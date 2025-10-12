module.exports = {
   help: ['hidetag'],
   use: 'text',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      conn.reply(m.chat, m.quoted ? m.quoted.text : text, null, {
         mentions: participants.map(v => v.id)
      })
   },
   group: true,
   admin: true,
   error: false
}