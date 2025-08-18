module.exports = {
   help: ['gemini', 'bard'],
   use: 'query',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'moonbot'))
         conn.sendReact(m.chat, '🕒', m.key)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (/image\/(jpe?g|png)/.test(mime)) {
            let img = await (await Scraper.uploader(await q.download())).data.url
            const json = await Api.get('/func-chat', {
               model: 'gemini',
               system: text,
               image: img
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.reply(m.chat, json.data.content, m)
         } else if (text) {
            const json = await Api.get('/ai-gemini', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.reply(m.chat, json.data.content, m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}