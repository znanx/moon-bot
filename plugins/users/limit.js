module.exports = {
   help: ['limit'],
   tags: 'user',
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      if (users.limit < 1) return conn.reply(m.chat, `🚩 Your limit on using bots is up.`, m)
      conn.reply(m.chat, Func.texted('bold', `🍉 Limit : [ ${Func.formatNumber(users.limit)} ]`), m)
   }
}