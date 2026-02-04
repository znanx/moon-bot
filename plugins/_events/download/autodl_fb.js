module.exports = {
   run: async (m, {
      conn,
      users,
      isPrem,
      setting,
      Func
   }) => {
      try {
         if (setting.autodownload && isPrem) {
            const regex = /https?:\/\/(www\.|web\.|m\.)?(facebook|fb)\.(com|watch)\S*/g
            const links = m.text.match(regex)
            if (links && links.length > 0) {
               const limitCost = 1
               if (users.limit < limitCost) {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Your limit is not enough to use this feature'), m)
               }
               users.limit -= limitCost
               conn.sendReact(m.chat, '🕒', m.key)
               for (const link of links) {
                  try {
                     let json = await Api.get('/downloader/fb', { url: link })
                     if (!json.status) {
                        conn.reply(m.chat, Func.jsonFormat(json), m)
                        continue
                     }
                     let result = json.data.find(v => v.quality == 'HD') || json.data.find(v => v.quality == 'SD')
                     if (result) {
                        conn.sendFile(m.chat, result.url, Func.filename(result.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${result.quality}`, m)
                     } else {
                        json.data.map(async v => {
                           await conn.sendFile(m.chat, v.url, Func.filename(v.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${v.quality}`, m)
                           await Func.delay(1500)
                        })
                     }
                  } catch (e) {
                     conn.reply(m.chat, Func.jsonFormat(e), m)
                  }
               }
            }
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   download: true,
   error: false
}