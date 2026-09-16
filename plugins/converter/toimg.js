const { readFileSync: read, unlinkSync: remove } = require('fs')
const path = require('path')
const { exec } = require('child_process')

module.exports = {
   help: ['toimg'],
   aliases: ['toimage'],
   use: 'reply sticker',
   tags: 'converter',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m

         if (!q) throw Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`)
         if (q.mimetype != 'image/webp') throw Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`)

         const isAnimated = q.isAnimated ?? q.msg?.isAnimated
         if (isAnimated) throw Func.texted('bold', '🚩 Not for animated stickers')

         conn.sendReact(m.chat, '🕒', m.key)

         let media = await conn.saveMediaMessage(m.quoted)
         let file = Func.filename('png')
         let isFile = path.join('./tmp/', file)
         exec(`ffmpeg -i ${media} ${isFile}`, (err, stderr, stdout) => {
            remove(media)
            if (err) throw Func.texted('bold', `🚩 Conversion failed.`)
            const buffer = read(isFile)
            conn.sendFile(m.chat, buffer, '', '', m)
            remove(isFile)
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}
