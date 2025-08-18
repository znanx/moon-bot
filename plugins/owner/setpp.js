const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys')
const Jimp = require('jimp')

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

async function generate(media) {
   const jimp = await Jimp.read(media)
   const min = jimp.getWidth()
   const max = jimp.getHeight()
   const cropped = jimp.crop(0, 0, min, max)
   return {
      img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
      preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
   }
}