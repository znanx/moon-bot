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
         if (!text) throw Func.texted('bold', `🚩 Give a text to make watermark.`)
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) throw Func.texted('bold', `🚩 Reply to the sticker you want to change the watermark.`)
         let img = await q.download()
         if (!img) throw global.status.wrong
         conn.sendSticker(m.chat, img, m, {
            packname: packname || '',
            author: author || ''
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true,
   error: false
}