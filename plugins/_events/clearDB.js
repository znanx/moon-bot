module.exports = {
   run: async (m, {
      conn,
      env,
      Func
   }) => {
      try {
         setInterval(async () => {
            let day = 86400000 * 3, now = new Date() * 1
            Object.entries(global.db.users).filter(([jid, user]) => now - user.lastseen > day && !user.premium && !user.banned).forEach(([jid, user]) => {
               delete global.db.users[jid]
            })
            Object.entries(global.db.chats).filter(([jid, chat]) => now - chat.lastseen > day).forEach(([jid, chat]) => {
               delete global.db.chats[jid]
            })
            Object.entries(global.db.groups).filter(([jid, group]) => now - group.activity > day).forEach(([jid, group]) => {
               delete global.db.groups[jid]
            })
         }, 60_000)
      } catch (e) {
         console.error(e)
      }
   },
   error: false
}