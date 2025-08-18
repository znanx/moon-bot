module.exports = {
   help: ['ohidetag'],
   use: 'text',
   tags: 'owner',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      let users = participants.map(u => u.id)
      await conn.reply(m.chat, text, null, {
         mentions: users
      })
   },
   owner: true,
   group: true
}