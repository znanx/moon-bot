module.exports = {
   help: ['tovideo'],
   aliases: ['togif'],
   use: 'reply gif sticker',
   tags: 'converter',
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let exif = global.db.setting
         if (!m.quoted) throw Func.texted('bold', `🚩 Reply to gif sticker.`)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) throw Func.texted('bold', `🚩 Reply to gif sticker.`)
         const image = await (await Scraper.uploader(await q.download())).data.url, old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/webp-convert', {
            url: image, action: 'webp-to-mp4'
         })
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}