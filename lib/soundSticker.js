const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execFile } = require('child_process')
const { promisify } = require('util')
const { Image } = require('node-webpmux')

const execFileAsync = promisify(execFile)

const TMP_DIR = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

const SAVE_TTL_MS = 10 * 60 * 1000
const SOUND_AUDIO_SYMBOL = Symbol('soundStickerAudio')
let encodePatched = false

const tempFile = (ext) => path.join(TMP_DIR, `sa_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`)

const safeUnlink = (filePath) => {
   try {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
   } catch {}
}

const getSessionMap = (conn) => {
   if (!conn.stickerAudio) conn.stickerAudio = new Map()
   return conn.stickerAudio
}

const saveUserAudio = (conn, sender, audioData) => {
   const map = getSessionMap(conn)
   const existing = map.get(sender)
   if (existing?.timer) clearTimeout(existing.timer)

   const timer = setTimeout(() => {
      const current = map.get(sender)
      if (current && current.timer === timer) {
         map.delete(sender)
      }
   }, SAVE_TTL_MS)
   if (typeof timer.unref === 'function') timer.unref()

   map.set(sender, {
      ...audioData,
      savedAt: Date.now(),
      expiresAt: Date.now() + SAVE_TTL_MS,
      timer
   })
}

const getUserAudio = (conn, sender) => {
   const map = getSessionMap(conn)
   const entry = map.get(sender)
   if (!entry) return null
   if (Date.now() > entry.expiresAt) {
      if (entry.timer) clearTimeout(entry.timer)
      map.delete(sender)
      return null
   }
   return entry
}

const clearUserAudio = (conn, sender) => {
   const map = getSessionMap(conn)
   const entry = map.get(sender)
   if (!entry) return false
   if (entry.timer) clearTimeout(entry.timer)
   map.delete(sender)
   return true
}

const extractOpusAudio = async (inputBuffer, ext = 'bin', maxSeconds = 10) => {
   const inPath = tempFile(ext)
   const outPath = tempFile('ogg')
   try {
      fs.writeFileSync(inPath, inputBuffer)
      await execFileAsync('ffmpeg', [
         '-nostdin',
         '-y',
         '-i', inPath,
         '-vn',
         '-map', '0:a:0',
         '-c:a', 'libopus',
         '-b:a', '32k',
         '-ac', '1',
         '-ar', '48000',
         '-t', String(maxSeconds),
         '-avoid_negative_ts', 'make_zero',
         outPath
      ], { timeout: 30000 })
      const outBuffer = fs.readFileSync(outPath)
      if (!outBuffer.length) throw new Error('EMPTY_AUDIO_OUTPUT')
      if (outBuffer.length > 950 * 1024) {
         throw new Error('AUDIO_TOO_LARGE')
      }
      return outBuffer
   } finally {
      safeUnlink(inPath)
      safeUnlink(outPath)
   }
}

const addStickerExif = async (webpBuffer, packname, author) => {
   const img = new Image()
   const json = {
      'sticker-pack-id': global.creator || 'Kiznavierr - kirara.bot',
      'sticker-pack-name': packname || 'Hoshikita Kirara',
      'sticker-pack-publisher': author || 'moon-bot',
      emojis: ['🎵']
   }
   const exifAttr = Buffer.from([
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00
   ])
   const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
   const exif = Buffer.concat([exifAttr, jsonBuffer])
   exif.writeUIntLE(jsonBuffer.length, 14, 4)
   await img.load(webpBuffer)
   img.exif = exif
   return await img.save(null)
}

const mediaToStickerWebp = async (inputBuffer, { isVideo = false, isWebp = false, ext = 'bin', packname, author } = {}) => {
   if (isWebp) {
      return await addStickerExif(inputBuffer, packname, author)
   }

   const inPath = tempFile(ext)
   const outPath = tempFile('webp')
   try {
      fs.writeFileSync(inPath, inputBuffer)
      const args = ['-nostdin', '-y', '-i', inPath]
      if (isVideo) {
         args.push(
            '-t', '5',
            '-vf', 'fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
            '-vcodec', 'libwebp',
            '-loop', '0',
            '-preset', 'default',
            '-an',
            '-vsync', '0',
            '-q:v', '50',
            outPath
         )
      } else {
         args.push(
            '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
            '-vcodec', 'libwebp',
            '-lossless', '0',
            '-q:v', '75',
            '-an',
            '-vsync', '0',
            outPath
         )
      }
      await execFileAsync('ffmpeg', args, { timeout: 30000 })
      const webpBuffer = fs.readFileSync(outPath)
      return await addStickerExif(webpBuffer, packname, author)
   } finally {
      safeUnlink(inPath)
      safeUnlink(outPath)
   }
}

const ensureSoundStickerEncoder = (proto) => {
   if (encodePatched) return
   const origEncode = proto.Message.encode

   proto.Message.encode = function patchedMessageEncode(message, writer) {
      const soundAudio = message?.stickerMessage?.[SOUND_AUDIO_SYMBOL]
      if (!soundAudio) {
         return origEncode.call(this, message, writer)
      }

      const stickerWriter = proto.Message.StickerMessage.encode(message.stickerMessage)
      stickerWriter.uint32((24 << 3) | 0).uint32(0)
      const audioBytes = proto.Message.AudioMessage.encode(soundAudio).finish()
      stickerWriter.uint32((26 << 3) | 2).bytes(audioBytes)
      const stickerWithAudioBytes = stickerWriter.finish()

      const innerMsgWriter = origEncode.call(this, {})
      innerMsgWriter.uint32((26 << 3) | 2).bytes(stickerWithAudioBytes)
      const innerMsgBytes = innerMsgWriter.finish()

      const futureProofWriter = origEncode.call(this, {})
      futureProofWriter.uint32((1 << 3) | 2).bytes(innerMsgBytes)
      const futureProofBytes = futureProofWriter.finish()

      const clone = { ...message }
      delete clone.stickerMessage
      const outWriter = origEncode.call(this, clone, writer)
      outWriter.uint32((134 << 3) | 2).bytes(futureProofBytes)
      return outWriter
   }

   encodePatched = true
}

const sendSoundSticker = async (conn, jid, webpBuffer, opusBuffer, quoted, { isAnimated = false } = {}) => {
   const {
      proto,
      prepareWAMessageMedia,
      generateWAMessageFromContent
   } = await import('@whiskeysockets/baileys')

   ensureSoundStickerEncoder(proto)

   const [stickerMedia, audioMedia] = await Promise.all([
      prepareWAMessageMedia({ sticker: webpBuffer, isAnimated }, { upload: conn.waUploadToServer, mediaUploadTimeoutMs: 30000 }),
      prepareWAMessageMedia({ audio: opusBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: false }, { upload: conn.waUploadToServer, mediaUploadTimeoutMs: 30000 })
   ])

   const msg = generateWAMessageFromContent(
      jid,
      {
         stickerMessage: {
            ...stickerMedia.stickerMessage,
            isAnimated: Boolean(isAnimated)
         }
      },
      {
         quoted,
         userJid: conn.user.id
      }
   )

   // Attach embedded AudioMessage via symbol so WAProto encoder wraps it in field 134 -> 1 -> 26
   msg.message.stickerMessage[SOUND_AUDIO_SYMBOL] = audioMedia.audioMessage

   await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
   return msg
}

module.exports = {
   SAVE_TTL_MS,
   saveUserAudio,
   getUserAudio,
   clearUserAudio,
   extractOpusAudio,
   mediaToStickerWebp,
   sendSoundSticker
}
