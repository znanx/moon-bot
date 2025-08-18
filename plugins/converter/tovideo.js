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
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to gif sticker.`), m)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to gif sticker.`), m)
         const image = await (await Scraper.uploader(await q.download())).data.url, old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/webp-convert', {
            url: image, action: 'webp-to-mp4'
         })
         conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         return conn.reply(m.chat, global.status.error, m)
      }
   },
   limit: true,
   error: false
}