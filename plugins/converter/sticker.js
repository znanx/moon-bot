module.exports = {
   help: ['sticker'],
   aliases: ['s', 'stiker'],
   use: 'query / reply media / reply album',
   tags: 'converter',
   run: async (m, {
      conn,
      store,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         await conn.sendReact(m.chat, '🕒', m.key).catch(() => { })

         if (m.quoted) {
            let rootId = m.quoted.mtype === 'albumMessage' ? m.quoted.id : null
            const msgs = (typeof store.loadMessages === 'function'
               ? store.loadMessages(m.chat, 250)
               : (store.messages[m.chat] || [])) || []
            if (!rootId) {
               const q = msgs.find(x => x.key?.id === m.quoted.id)
               rootId = q?.message?.messageContextInfo?.messageAssociation?.parentMessageKey?.id || null
            }
            if (rootId) {
               const rootMsg = msgs.find(x => x.key?.id === rootId)
               const expectedTotal = (rootMsg?.message?.albumMessage?.expectedImageCount ?? 0)
                  + (rootMsg?.message?.albumMessage?.expectedVideoCount ?? 0)
               const items = msgs.filter(x => {
                  const a = x.message?.messageContextInfo?.messageAssociation
                  return a?.parentMessageKey?.id === rootId && (x.message?.imageMessage || x.message?.videoMessage)
               })
               items.sort((a, b) => (a.messageTimestamp ?? 0) - (b.messageTimestamp ?? 0))
               if (!items.length) throw Func.texted('bold', '🚩 Album tidak ditemukan di store. Kirim ulang album lalu coba lagi.')
               if (expectedTotal > 0 && items.length < expectedTotal)
                  throw Func.texted('bold', `🚩 Album belum lengkap: ${items.length}/${expectedTotal}. Kirim ulang album lalu coba lagi.`)
               const stickers = []
               for (const item of items) {
                  const buf = await conn.downloadMediaMessage(item)
                  if (buf) stickers.push(buf)
               }
               if (!stickers.length) throw Func.texted('bold', '🚩 Gagal mengunduh media album.')
               const res = await conn.sendStickerPack(m.chat, stickers, m, {
                  name: `Sticker by ${m.pushName}`,
                  publisher: setting.sk_author,
                  description: `${stickers.length} Stickers`,
                  cover: await Func.fetchBuffer('./src/image/thumbnail.jpg'),
                  exif: { packname: setting.sk_pack, author: setting.sk_author }
               })
               if (res?.stickerCount) {
                  return conn.reply(m.chat, `✅ Pack ${res.stickerCount} stiker terkirim.`, m)
               }
            }
         }

         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await conn.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) throw Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`)
               return conn.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else if (/image/.test(type)) {
               return conn.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) throw global.status.wrong
               return conn.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) throw Func.texted('bold', `🚩 Maximum video duration is 10 seconds.`)
               let img = await q.download()
               if (!img) throw global.status.wrong
               return conn.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else if (m.mentionedJid && m.mentionedJid[0]) {
               let url = await Promise.race([
                  conn.profilePictureUrl(m.mentionedJid[0], 'image'),
                  new Promise((resolve) => setTimeout(() => resolve('https://archio.qzz.io/1770100074980-default.jpg'), 1500))
               ]).catch(() => 'https://archio.qzz.io/1770100074980-default.jpg')
               return conn.sendSticker(m.chat, url, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(text || '')) {
               return conn.sendSticker(m.chat, text, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else throw Func.texted('bold', `🚩 Kirim atau balas gambar dengan perintah *${usedPrefix + command}*.`)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: false,
   error: false
}
