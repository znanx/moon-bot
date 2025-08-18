const { Converter } = new (require('@znan/wabot'))
const { readFileSync: read, unlinkSync: remove, writeFileSync: create } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')

module.exports = {
   help: ['tomp3', 'tovn'],
   use: 'reply media',
   tags: 'converter',
   run: async (m, {
      conn,
      command,
      Func
   }) => {
      try {
         if (m.quoted && typeof m.quoted.buttons != 'undefined' && typeof m.quoted.videoMessage != 'undefined') {
            conn.sendReact(m.chat, '🕒', m.key)
            const media = await conn.saveMediaMessage(m.quoted.videoMessage)
            const result = Func.filename('mp3')
            exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
               remove(media)
               if (err) return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
               let buff = read(result)
               if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                  remove(result)
               })
               if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               }).then(() => {
                  remove(result)
               })
            })
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
            if (/ogg/.test(mime)) {
               conn.sendReact(m.chat, '🕒', m.key)
               let buffer = await q.download()
               const media = path.join(tmpdir(), Func.filename('mp3'))
               let save = create(media, buffer)
               const result = Func.filename('mp3')
               exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
                  remove(media)
                  if (err) return conn.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
                  let buff = read(result)
                  if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                     remove(result)
                  })
                  if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                     ptt: true
                  }).then(() => {
                     remove(result)
                  })
               })
            } else if (/audio|video/.test(mime)) {
               conn.sendReact(m.chat, '🕒', m.key)
               const buff = await Converter.toAudio(await q.download(), 'mp3')
               if (/tomp3|toaudio/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m)
               if (/tovn/.test(command)) return conn.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               })
            } else {
               conn.reply(m.chat, Func.texted('bold', `🚩 This feature only for audio / video.`), m)
            }
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}