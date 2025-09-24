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

const Jimp = require('jimp')
/**
 * Crops an image buffer to a specified landscape aspect ratio.
 * @param {Buffer} inputBuffer - The input image buffer.
 * @param {number} aspectRatio - The desired aspect ratio (default is 16:9).
 * @param {Buffer} quality - Image quality. (default is 50)
 * @returns {Promise<Buffer>} - The cropped image buffer.
 */
const cropToLandscapeBuffer = async (inputBuffer, aspectRatio = 16 / 9, quality = 50) => {
   try {
      const image = await Jimp.read(inputBuffer)
      const { width, height } = image.bitmap
      const currentAspectRatio = width / height

      let cropWidth, cropHeight

      if (currentAspectRatio > aspectRatio) {
         cropWidth = Math.floor(height * aspectRatio)
         cropHeight = height
      } else {
         cropWidth = width
         cropHeight = Math.floor(width / aspectRatio)
      }

      const x = Math.floor((width - cropWidth) / 2)
      const y = Math.floor((height - cropHeight) / 2)

      image.crop(x, y, cropWidth, cropHeight)

      // Tambahkan kompresi JPEG (semakin kecil, semakin terkompres)
      image.quality(quality) // default: 100

      const outputBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      return outputBuffer
   } catch (error) {
      console.error('Error cropping image:', error.message)
      throw error
   }
}