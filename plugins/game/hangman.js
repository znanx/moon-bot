const Hangman = require('lib/hangman')

module.exports = {
   help: ['hangman'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         conn.hangman = conn.hangman ? conn.hangman : {}
         let [action, inputs] = args

         switch (action) {
            case 'end':
               if (conn.hangman[m.chat] && conn.hangman[m.chat].sessionId === m.sender) {
                  delete conn.hangman[m.chat]
                  throw 'Successfully exit Hangman game session.'
               } else {
                  throw 'There is no Hangman session in progress or you are not the player.'
               }
            break
            
            case 'start':
               if (conn.hangman[m.chat]) {
                  throw `The Hangman session is already underway, use *${usedPrefix + command}* end to end the session.`
               } else {
                  conn.hangman[m.chat] = new Hangman(m.sender)
                  const gameSession = conn.hangman[m.chat]
                  await gameSession.initializeGame()
                  await m.reply(`Hangman session begins. 🎉\n\n*Session ID* : ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Guess the Word* :\n${gameSession.displayWord()}\n\nSend letter to guess\n\n*Example* : *${usedPrefix + command} guess a*`)
               }
            break

            case 'guess':
               if (conn.hangman[m.chat]) {
                  if (!inputs || !/^[a-zA-Z]$/.test(inputs)) throw `Enter the letter you want to guess after *guess*. Example : *${usedPrefix + command} guess a*`

                  const gameSession = conn.hangman[m.chat]
                  const userGuess = inputs.toLowerCase()
                  const result = gameSession.makeGuess(userGuess)

                  const messages = {
                     invalid: "Enter a valid letter.",
                     repeat: "You have guessed this letter before. Try another letter.",
                     continue: `*Guessed Letters:*\n${gameSession.guesses.join(", ")}\n${gameSession.displayBoard()}\n\n*Guessed Words:*\n${gameSession.displayWord()}\n\n*Attempts Left:* ${gameSession.maxAttempts - gameSession.currentStage}`,
                     over: `Game Over! You lose. The correct word is *${gameSession.quest.quest}*. 💀`,
                     win: "Congratulations! You win in the Hangman game. 🎉",
                  }

                  await m.reply(messages[result])

                  if (result === 'over' || result === 'win') {
                     delete conn.hangman[m.chat]
                  }
               } else {
                  throw `There are no Hangman sessions in progress, use *${usedPrefix + command} start* to start the session.`
               }
               break

            case 'hint':
               if (conn.hangman[m.chat]) {
                  const gameSession = conn.hangman[m.chat]
                  await m.reply(gameSession.getHint())
               } else {
                  throw `There are no Hangman sessions in progress, use *${usedPrefix + command} start* to start the session.`
               }
            break

            case 'help':
               let p = '乂  *H A N G M A N*' + '\n\n'
                  + '*Command* :' + '\n'
                  + `◦ *${usedPrefix + command} start* : start game.` + '\n'
                  + `◦ *${usedPrefix + command} end* : exit the game session.` + '\n'
                  + `◦ *${usedPrefix + command} guess [letter]* : guess the letter in a word.` + '\n'
                  + `◦ *${usedPrefix + command} hint* : Get a word clue.`
               throw p
            break

            default:
               throw `Invalid action, Use *${usedPrefix + command} help* to see how to use the command.`
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   game: true,
   error: false
}