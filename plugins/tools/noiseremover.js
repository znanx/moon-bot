module.exports = {
   help: ['noiseremover'],
   aliases: ['noise'],
   use: 'reply audio',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Scraper,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply audio.`), m)
         if (!/audio\/(mpeg|vn)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for audio.`), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let audio = await q.download()
         let result = await Scraper.uploader(audio)
         const json = await Api.get('/noise-remover', {
            audio: result.data.url
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}