module.exports = {
   help: ['aieditor'],
   aliases: ['aiedit'],
   use: 'query & reply media',
   tags: 'ai',
   run: async (m, {
      conn,
      text,
      usedPrefix,
      command,
      Func,
      Scraper
   }) => {
      try {
         const prompt = text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : null
         if (!prompt) return m.reply(Func.example(usedPrefix, command, 'change the color to black'))
         let old = new Date()
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await conn.downloadMediaMessage(q)
            if (!/image/.test(type)) return conn.reply(m.chat, Func.texted('bold', `Stress ??`), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const srv = await Scraper.uploader(img)
            if (!srv.status) return m.reply(Func.jsonFormat(srv))
            const json = await Api.get('/ai-edit', {
               image: srv.data.url,
               prompt: prompt
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `Stress ??`), m)
            let img = await q.download()
            if (!img) return conn.reply(m.chat, global.status.wrong, m)
            conn.sendReact(m.chat, '🕒', m.key)
            const srv = await Scraper.uploader(img)
            if (!srv.status) return m.reply(Func.jsonFormat(srv))
            const json = await Api.get('/ai-edit', {
               image: srv.data.url,
               prompt: prompt
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   limit: 5
}