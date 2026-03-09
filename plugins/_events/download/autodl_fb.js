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
                     const result = json?.data?.result?.find(v => v.quality === 'HD') ?? json?.data?.result?.find(v => v.quality === 'SD') ?? null
                     return conn.sendFile(m.chat, result.url, Func.filename(result.quality === 'jpeg' ? 'jpeg' : 'mp4'), `◦ *Quality* : ${result.quality}`, m)
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