module.exports = {
   help: ['sticker'],
   aliases: ['s', 'stiker'],
   use: 'query / reply media',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
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
            } else throw Func.texted('bold', `🚩 Send or reply to the image you want to make into a sticker.`)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: false,
   error: false
}