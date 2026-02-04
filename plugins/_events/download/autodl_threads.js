module.exports = {
   run: async (m, {
      conn,
      body,
      users,
      isPrem,
      setting,
      Func
   }) => {
      try {
         if (setting.autodownload && isPrem) {
            const regex = /^(?:https?:\/\/)?(?:www\.)?threads\.net\/(?:\d+|[\w-]+)(?:\/)?$/
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
                     let json = await Api.get('/downloader/threads', {
                        url: link
                     })
                     if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
                     for (let i of json.data) {
                        conn.sendFile(m.chat, i.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
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