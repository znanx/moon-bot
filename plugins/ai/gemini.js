module.exports = {
   help: ['gemini'],
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
         if (!text) throw Func.example(usedPrefix, command, 'moonbot')
         conn.sendReact(m.chat, '🕒', m.key)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (/image\/(jpe?g|png)/.test(mime)) {
            const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
            if (!cdn.status) throw Func.jsonFormat(cdn)
            const json = await Api.get('/ai/chat/vision', {
               model: 'gemini',
               prompt: text,
               image_url: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, json.data.content, m)
         } else if (text) {
            const json = await Api.get('/ai/gemini', {
               prompt: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, json.data.content, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}