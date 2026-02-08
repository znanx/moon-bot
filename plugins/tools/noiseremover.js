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
         if (!mime) throw Func.texted('bold', `🚩 Reply audio.`)
         if (!/audio\/(mpeg|vn)/.test(mime)) throw Func.texted('bold', `🚩 Only for audio.`)
         conn.sendReact(m.chat, '🕒', m.key)
         const cdn = await Scraper.uploader(await q.download())
         if (!cdn.status) throw Func.jsonFormat(cdn)
         const json = await Api.get('/tools/noiseremover', {
            audio_url: cdn.data.url
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}