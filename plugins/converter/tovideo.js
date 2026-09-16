const { Converter } = require('@znan/wabot')

module.exports = {
   help: ['tovideo'],
   aliases: ['togif', 'tomp4'],
   use: 'reply gif sticker',
   tags: 'converter',
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         let old = new Date()
         if (!m.quoted) throw Func.texted('bold', `🚩 Reply to gif sticker.`)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) throw Func.texted('bold', `🚩 Reply to gif sticker.`)

         const isAnimated = q.isAnimated ?? q.msg?.isAnimated
         if (!isAnimated) throw Func.texted('bold', '🚩 only for animated stickers')

         conn.sendReact(m.chat, '🕒', m.key)

         const buffer = await q.download()
         const json = await Converter.webpToMp4(buffer)

         const isGif = command === 'togif'
         const ext = isGif ? 'gif' : 'mp4'
         return conn.sendFile(m.chat, json, Func.filename(ext), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m, {
            gif: isGif
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
