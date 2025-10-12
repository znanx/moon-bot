
module.exports = {
   help: ['hdvideo'],
   use: 'reply video',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/video/.test(type)) {
               conn.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               const cdn = await Scraper.uploader(await conn.downloadMediaMessage(q))
               if (!cdn.status) throw Func.jsonFormat(cdn)
               const json = await Api.get('/remini-video', {
                  video: cdn.data.url
               })
               if (!json.status) throw Func.jsonFormat(json)
               conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } throw Func.texted('bold', `🚩 Only for video.`)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) throw Func.texted('bold', `🚩 Reply video.`)
            if (!/video\/(mp4)/.test(mime)) throw Func.texted('bold', `🚩 Only for video.`)
            conn.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            const cdn = await Scraper.uploader(await q.download())
            if (!cdn.status) throw Func.jsonFormat(cdn)
            const json = await Api.get('/remini-video', {
               video: cdn.data.url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}