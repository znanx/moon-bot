module.exports = {
   run: async (m, {
      conn,
      users,
      Func
   }) => {
      conn.hangman = conn.hangman || {}
      const id = m.chat
      if (!m.quoted || !(id in conn.hangman)) return

      const game = conn.hangman[id]
      if (m.quoted.id !== game.msg.id) return
      const guess = m.text.trim().toLowerCase()

      if (!/^[a-zA-Z]$/.test(guess)) return m.react('⁉️')
      if (game.guessed.includes(guess)) return m.react('🔁')
      game.guessed.push(guess)

      if (game.answer.includes(guess)) {
         game.answer.split('').forEach((c, i) => {
            if (c === guess) game.display[i] = c
         })

         if (!game.display.includes('_')) {
            clearTimeout(game.timer)
            delete conn.hangman[id]
            users.exp += 250
            return m.react('✅').then(() =>
               conn.reply(m.chat, `🎉 *Correct!* The word was: *${game.answer}*\n*+250 EXP*`, m)
            )
         }

         return m.react('🟩').then(() =>
            conn.reply(
               m.chat,
               `✅ Correct!\n\n` +
               `Word : ${game.display.join(' ')}\n` +
               `Guessed : ${game.guessed.join(', ')}`,
               m
            )
         )
      } else {
         game.tries -= 1

         if (game.tries <= 0) {
            clearTimeout(game.timer)
            delete conn.hangman[id]
            return m.react('💀').then(() =>
               conn.reply(m.chat, `💀 You lose!`, m)
            )
         }

         m.react('🟥')
         return conn.reply(
            m.chat,
            `❌ Wrong!\n\n` +
            `Word : ${game.display.join(' ')}\n` +
            `Guessed : ${game.guessed.join(', ')}\n` +
            `Chance left : ${game.tries}`,
            m
         )
      }
   },
   game: true,
   group: true,
   error: false
}