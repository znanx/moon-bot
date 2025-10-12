module.exports = [{
   help: ['hangman'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         conn.hangman = conn.hangman || {}
         const id = m.chat

         if (id in conn.hangman) return conn.reply(m.chat, '^ There is still an active Hangman game in this chat.', conn.hangman[id].msg)

         const res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/tebakkata.json')
         const list = await res.json()
         const data = list[Math.floor(Math.random() * list.length)]
         const answer = data.jawaban.toLowerCase()

         const masked = answer.replace(/[a-zA-Z]/g, '_')
         const maxTries = 6
         const time = 120000 // 2 menit

         const gameMsg = await conn.reply(
            m.chat,
            `乂  *H A N G M A N*\n\n` +
            `Hint : *${data.soal}*\n` +
            `Word : ${masked.split('').join(' ')}\n` +
            `Chance : ${maxTries}\n\n` +
            `Reply this message with a *letter* to guess.`,
            m
         )

         conn.hangman[id] = {
            msg: gameMsg,
            answer,
            guessed: [],
            display: masked.split(''),
            tries: maxTries,
            timer: setTimeout(() => {
               if (conn.hangman[id]) {
                  conn.reply(m.chat, `Time's up!`, gameMsg)
                  delete conn.hangman[id]
               }
            }, time)
         }
      } catch (e) {
         console.error(e)
         conn.reply(m.chat, Func.texted('bold', '🚩 Error while starting the game.'), m)
      }
   },
   game: true,
   group: true,
   limit: true
}, {
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
   group: true
}]