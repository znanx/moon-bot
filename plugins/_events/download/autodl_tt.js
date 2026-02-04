module.exports = {
   run: async (m, {
      conn,
      users,
      body,
      isPrem,
      setting,
      Func
   }) => {
      try {
         if (setting.autodownload && isPrem) {
            const regex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/;
            const links = body.match(regex)
            if (links && links.length > 0) {
               const limitCost = 1
               if (users.limit < limitCost) {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Your limit is not enough to use this feature'), m)
               }
               users.limit -= limitCost
               conn.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               for (const link of links) {
                  try {
                     let json = await Api.get('/downloader/tiktok', {
                        url: link
                     })
                     if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
                     let result = json.data.find(v => v.type == 'nowatermark')
                     if (!result) {
                        json.data.map(x => {
                           conn.sendFile(m.chat, x.url, Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
                        })
                     } else {
                        conn.sendFile(m.chat, result.url, Func.filename('mp4'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
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