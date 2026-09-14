module.exports = {
   help: ['setpp'],
   use: 'reply photo',
   tags: 'owner',
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
                  xmlns: 'w:profile:picture'
               },
               content: [{
                  tag: 'picture',
                  attrs: {
                     type: 'image'
                  },
                  content: img
               }]
            })
            conn.reply(m.chat, Func.texted('bold', `🚩 Profile photo has been successfully changed.`), m)
         } else return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to the photo that will be made into the bot's profile photo.`), m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true,
   error: false
}

const sharp = require('sharp')

async function generate(media) {
   const image = sharp(media)
   const { width, height } = await image.metadata()

   if (!width || !height) {
      throw new Error('Invalid image dimensions')
   }

   const size = Math.min(width, height)

   const cropped = image.extract({
      left: 0,
      top: 0,
      width: size,
      height: size
   })

   return {
      img: await cropped
         .clone()
         .resize(720, 720)
         .jpeg({ quality: 100 })
         .toBuffer(),

      preview: await cropped
         .clone()
         .normalise()
         .jpeg({ quality: 100 })
         .toBuffer()
   }
}