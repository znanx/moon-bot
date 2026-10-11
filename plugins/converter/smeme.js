module.exports = {
   help: ['smeme'],
   aliases: ['stickermeme'],
   use: 'text | text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      setting,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'Hi | Dude')
         conn.sendReact(m.chat, '🕒', m.key)
         let [top, bottom] = text.split`|`
         let media
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (!/image|video|sticker/.test(type)) throw Func.texted('bold', `🚩 Media is not supported, only pictures, videos and stickers.`)
            media = await conn.downloadMediaMessage(q)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw Func.texted('bold', `🚩 Reply photo.`)
            if (!/webp|image\/|video\//.test(mime)) throw Func.texted('bold', `🚩 Media is not supported, only pictures, videos and stickers.`)
            media = await q.download()
         }
         const cdn = await Scraper.uploader(media)
         if (!cdn.status) throw Func.texted('bold', `🚩 Upload failed.`)
         const json = await Api.get('/canvas/stickermeme', {
            media_url: cdn.data.url,
            text_top: top ? top : ' ',
            text_bottom: bottom ? bottom : ''
         })
         if (!json.status || !json.data?.url) throw Func.texted('bold', `🚩 Failed to create meme sticker.`)
         return conn.sendSticker(m.chat, json.data.url, m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
