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
         if (!prompt) throw Func.example(usedPrefix, command, 'change the color to black')
         let old = new Date()
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await conn.downloadMediaMessage(q)
            if (!/image/.test(type)) throw Func.texted('bold', `Stress ??`)
            conn.sendReact(m.chat, '🕒', m.key)
            const srv = await Scraper.uploader(img)
            if (!srv.status) throw Func.jsonFormat(srv)
            const json = await Api.get('/ai/edit', {
               image_url: srv.data.url,
               prompt: prompt
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) throw Func.texted('bold', `Stress ??`)
            let img = await q.download()
            if (!img) throw global.status.wrong
            conn.sendReact(m.chat, '🕒', m.key)
            const srv = await Scraper.uploader(img)
            if (!srv.status) throw Func.jsonFormat(srv)
            const json = await Api.get('/ai/edit', {
               image_url: srv.data.url,
               prompt: prompt
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.images[0].url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   error: false,
   limit: 5
}