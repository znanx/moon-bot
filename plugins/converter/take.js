module.exports = {
   help: ['take'],
   aliases: ['wm'],
   use: 'packname | author',
   tags: 'converter',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.texted('bold', `🚩 Give a text to make watermark.`), m)
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to the sticker you want to change the watermark.`), m)
         let img = await q.download()
         if (!img) return conn.reply(m.chat, global.status.wrong, m)
         conn.sendSticker(m.chat, img, m, {
            packname: packname || '',
            author: author || ''
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true,
   error: false
}