module.exports = {
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      conn.susunkata = conn.susunkata || {}
      const id = m.chat
      if (!m.quoted || !(id in conn.susunkata)) return

      const game = conn.susunkata[id]
      if (m.quoted.id !== game.msg.id) return

      const guess = m.text.trim().toLowerCase()
      if (guess === game.answer) {
         clearTimeout(game.timer)
         delete conn.susunkata[id]
         users.exp += 200
         return m.react('✅').then(() =>
            conn.reply(m.chat, `🎉 Benar! Kata itu *${game.answer}* *+200 EXP*`, m)
         )
      } else {
         clearTimeout(game.timer)
         delete conn.susunkata[id]
         return m.react('❌').then(() =>
            conn.reply(m.chat, `❌ Salah!`, m)
         )
      }
   },
   game: true,
   group: true,
   error: false
}