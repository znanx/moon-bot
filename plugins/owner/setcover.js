module.exports = {
   help: ['setcover'],
   use: 'reply foto',
   tags: 'owner',
   run: async (m, {
      conn,
      Scraper,
      Func
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/image/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Image not found.`), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const buffer = await cropToLandscapeBuffer(await q.download())
         if (!buffer) throw new Error(global.status.wrong)
         global.db.setting.cover = Buffer.from(buffer).toString('base64')
         conn.reply(m.chat, Func.texted('bold', `🚩 Cover successfully set.`), m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   owner: true
}

const sharp = require('sharp')

/**
 * Crops an image buffer to a specified landscape aspect ratio.
 * @param {Buffer} inputBuffer - The input image buffer.
 * @param {number} aspectRatio - The desired aspect ratio (default is 16:9).
 * @param {number} quality - Image quality (default is 50).
 * @returns {Promise<Buffer>} - The cropped image buffer.
 */
const cropToLandscapeBuffer = async (inputBuffer, aspectRatio = 16 / 9, quality = 50) => {
   try {
      const image = sharp(inputBuffer)
      const { width, height } = await image.metadata()

      if (!width || !height) {
         throw new Error('Invalid image dimensions')
      }

      const currentAspectRatio = width / height

      let cropWidth
      let cropHeight

      if (currentAspectRatio > aspectRatio) {
         cropWidth = Math.floor(height * aspectRatio)
         cropHeight = height
      } else {
         cropWidth = width
         cropHeight = Math.floor(width / aspectRatio)
      }

      const left = Math.floor((width - cropWidth) / 2)
      const top = Math.floor((height - cropHeight) / 2)

      return await image
         .extract({
            left,
            top,
            width: cropWidth,
            height: cropHeight
         })
         .jpeg({ quality })
         .toBuffer()
   } catch (error) {
      console.error('Error cropping image:', error.message)
      throw error
   }
}