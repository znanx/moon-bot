const { saveUserAudio, extractOpusAudio } = require('../../lib/soundSticker')

module.exports = {
   help: ['sa'],
   aliases: ['saveaudio'],
   use: 'reply audio / video',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         if (!/audio|video/.test(mime)) {
            return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to an audio, voice note, or video with *${usedPrefix + command}*.`), m)
         }

         await conn.sendReact(m.chat, '🕒', m.key).catch(() => {})
         const rawBuffer = await q.download()
         if (!rawBuffer) throw global.status.wrong

         const ext = /video/.test(mime) ? 'mp4' : /ogg/.test(mime) ? 'ogg' : 'mp3'
         let opusBuffer
         try {
            opusBuffer = await extractOpusAudio(rawBuffer, ext, 10)
         } catch (err) {
            if (err.message === 'AUDIO_TOO_LARGE') {
               return conn.reply(m.chat, Func.texted('bold', '🚩 Audio size is too large (maximum ~950 KB).'), m)
            }
            return conn.reply(m.chat, Func.texted('bold', '🚩 Failed to extract audio. Make sure the media has a valid audio track.'), m)
         }

         saveUserAudio(conn, m.sender, {
            buffer: opusBuffer,
            mimetype: 'audio/ogg; codecs=opus'
         })

         return conn.reply(
            m.chat,
            `🚩 Audio saved for *10 minutes*.\nSend or reply to an image, GIF, video, or sticker with *${usedPrefix}stcaudio* to create a sound sticker, or *${usedPrefix}csa* to clear your saved audio.`,
            m
         )
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}
