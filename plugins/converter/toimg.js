const { readFileSync: read, unlinkSync: remove } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')

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
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`), m)
         if (m.quoted.mimetype != 'image/webp') return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let media = await conn.downloadAndSaveMediaMessage(m.quoted)
         let file = Func.filename('png')
         let isFile = path.join(tmpdir(), file)
         exec(`ffmpeg -i ${media} ${isFile}`, (err, stderr, stdout) => {
            remove(media)
            if (err) return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
            const buffer = read(isFile)
            conn.sendFile(m.chat, buffer, '', '', m)
            remove(isFile)
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}
