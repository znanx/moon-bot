const {
   getUserAudio,
   extractOpusAudio,
   mediaToStickerWebp,
   sendSoundSticker
} = require('../../lib/soundSticker')

module.exports = {
   help: ['stcaudio'],
   aliases: ['saudio', 'stickeraudio', 'stikeraudio'],
   use: 'reply image / gif / video / sticker',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      setting,
      Func
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         const isImage = /image\/(jpe?g|png)/.test(mime)
         const isGif = /image\/gif/.test(mime)
         const isVideo = /video/.test(mime)
         const isWebp = /webp/.test(mime)

         if (!isImage && !isGif && !isVideo && !isWebp) {
            return conn.reply(
               m.chat,
               Func.texted('bold', `🚩 Send or reply to an image, GIF, video, or sticker with *${usedPrefix + command}*.`),
               m
            )
         }

         if (isVideo && (q.msg || q).seconds > 10) {
            return conn.reply(m.chat, Func.texted('bold', '🚩 Maximum video duration is 10 seconds.'), m)
         }

         const saved = getUserAudio(conn, m.sender)
         if (!saved && !isVideo) {
            return conn.reply(
               m.chat,
               Func.texted('bold', `🚩 No saved audio found. Reply to an audio/VN first with *${usedPrefix}sa* before using *${usedPrefix + command}*.`),
               m
            )
         }

         await conn.sendReact(m.chat, '🕒', m.key).catch(() => {})
         const visualBuffer = await q.download()
         if (!visualBuffer) throw global.status.wrong

         let opusBuffer = saved?.buffer || null
         if (!opusBuffer && isVideo) {
            try {
               opusBuffer = await extractOpusAudio(visualBuffer, 'mp4', 5)
            } catch (err) {
               if (err.message === 'AUDIO_TOO_LARGE') {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Video audio size is too large (maximum ~950 KB).'), m)
               }
               return conn.reply(
                  m.chat,
                  Func.texted('bold', `🚩 This video has no audio track. Send a video with sound or save an audio first using *${usedPrefix}sa*.`),
                  m
               )
            }
         }

         const isAnimated = Boolean(isVideo || isGif || (isWebp && (q.msg?.isAnimated || q.isAnimated)))
         const ext = isGif ? 'gif' : isVideo ? 'mp4' : /png/.test(mime) ? 'png' : 'jpg'
         const webpBuffer = await mediaToStickerWebp(visualBuffer, {
            isVideo: isVideo || isGif,
            isWebp,
            ext,
            packname: setting?.sk_pack || 'Hoshikita Kirara',
            author: setting?.sk_author || 'moon-bot'
         })

         await sendSoundSticker(conn, m.chat, webpBuffer, opusBuffer, m, { isAnimated })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}
