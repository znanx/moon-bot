module.exports = {
   run: async (m, {
      conn,
      users,
      isPrem,
      setting,
      body,
      Func
   }) => {
      try {
         if (setting.autodownload && isPrem) {
            const regex = /^(https?:\/\/)?(www\.)?twitter|x\.com\/(?:#!\/)?([a-zA-Z0-9_]+)\/status(es)?\/(\d+)$/;
            const links = body.match(regex)
            if (links && links.length > 0) {
               const limitCost = 1
               if (users.limit < limitCost) {
                  return conn.reply(m.chat, Func.texted('bold', '🚩 Your limit is not enough to use this feature'), m)
               }
               users.limit -= limitCost
               conn.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               for (let link of links) {
                  try {
                     const json = await Api.get('/twitter', {
                        url: link
                     })
                     console.log(link)
                     if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
                     let url = json.data.find((v) => v.url).url
                     await conn.sendFile(m.chat, url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
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