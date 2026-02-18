module.exports = {
   help: ['tovideo'],
   aliases: ['togif', 'tomp4'],
   use: 'reply gif sticker',
   tags: 'converter',
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let exif = global.db.setting
         let old = new Date()
         if (!m.quoted) throw Func.texted('bold', `🚩 Reply to gif sticker.`)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) throw Func.texted('bold', `🚩 Reply to gif sticker.`)
         conn.sendReact(m.chat, '🕒', m.key)
         const cdn = await Scraper.uploader(await q.download())
         if (!cdn.status) throw Func.jsonFormat(cdn)
         const json = await Api.post('/converter/file', {
            file_url: cdn.data.url, output_format: 'gif'
         })
         conn.sendFile(m.chat, json.data.url, Func.filename('gif'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m, {
            gif: true
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}