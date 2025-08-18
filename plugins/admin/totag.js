module.exports = {
   help: ['totag'],
   use: 'reply chat',
   tags: 'admin',
   run: async (m, {
      conn,
      text,
      participants,
      Func
   }) => {
      let users = participants.map(v => v.id).filter(v => v !== conn.user.id)
      if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', '🚩 Reply chat'), m)
      conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users })
   },
   group: true,
   admin: true,
   error: false
}