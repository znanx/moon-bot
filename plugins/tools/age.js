module.exports = {
   help: ['age'],
   use: 'reply photo',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               conn.sendReact(m.chat, '🕒', m.key)
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/tools/face/detector', {
                  image_url: cdn.data.url
               })
               if (!json.status) throw Func.jsonFormat(json)
               conn.reply(m.chat, `Gender : ${json.data.gender}\nAge : ${json.data.age}`, m)
            } else conn.reply(m.chat, 'Only for photo.', m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw `Reply photo with command ${usedPrefix + command}.`
            if (!/image\/(jpe?g|png)/.test(mime)) throw 'Only for photo.'
            conn.sendReact(m.chat, '🕒', m.key)
            const cdn = await Scraper.uploader(await q.download())
            if (!cdn.status) throw Func.jsonFormat(cdn)
            const json = await Api.get('/face/detector', {
               image: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, `Gender : ${json.data.gender}\nAge : ${json.data.age}`, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}