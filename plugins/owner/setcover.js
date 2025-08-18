module.exports = {
   help: ['setcover'],
   use: 'reply foto',
   tags: 'owner',
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      let setting = global.db.setting
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/image/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Image not found.`), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let img = await q.download()
         if (!img) return conn.reply(m.chat, global.status.wrong, m)
         let link = await Scraper.imgbb(img)
         if (!link.status) return m.reply(Func.jsonFormat(link))
         setting.cover = link.data.url
         conn.reply(m.chat, Func.texted('bold', `🚩 Cover successfully set.`), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}