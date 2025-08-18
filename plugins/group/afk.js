module.exports = {
   help: ['afk'],
   use: 'reason (optional)',
   tags: 'group',
   run: async (m, {
      conn,
      text,
      users,
      Func
   }) => {
      try {
         users.afk = +new Date
         users.afkReason = text
         users.afkObj = m
         return conn.reply(m.chat, `@${m.sender.split`@`[0]} is now AFK!`, m)
      } catch {
         conn.reply(m.chat, global.status.error, m)
      }
   },
   group: true,
   error: false
}