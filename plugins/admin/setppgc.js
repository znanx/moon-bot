module.exports = {
   help: ['setppgc'],
   use: 'reply photo',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      const { S_WHATSAPP_NET } = await import('@whiskeysockets/baileys')
      try {
         let q = m.quoted ? m.quoted : m
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         if (/image\/(jpe?g|png)/.test(mime)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const buffer = await q.download()
            const { img } = await generate(buffer)
            await conn.query({
               tag: 'iq',
               attrs: {
                  to: S_WHATSAPP_NET,
                  type: 'set',
                  xmlns: 'w:profile:picture',
                  target: m.chat
               },
               content: [{
                  tag: 'picture',
                  attrs: {
                     type: 'image'
                  },
                  content: img
               }]
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 Group profile picture has been successfully changed.`), m)
         } else return conn.reply(m.chat, Func.texted('bold', `🚩 Reply or send the image you want to use as the group's profile picture`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}

const sharp = require('sharp')

sharp.cache(false)
sharp.concurrency(Math.max(1, Math.min(2, Number(process.env.SHARP_CONCURRENCY || 2))))

async function generate (media) {
   try {
      const base = sharp(media)

      const [img, preview] = await Promise.all([
         base.clone().resize(720, 720, { fit: 'inside' }).jpeg().toBuffer(),
         base.clone().normalise().jpeg().toBuffer()
      ])

      return {
         img,
         preview
      }
   } catch (e) {
      return {
         img: media,
         preview: media
      }
   }
}
