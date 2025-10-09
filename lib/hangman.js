const { Function: Func } = require('@znan/wabot')

class Hangman {
   constructor(id) {
      this.sessionId = id
      this.guesses = []
      this.maxAttempts = 0
      this.currentStage = 0
   }

   getRandomQuest = async () => {
      try {
         const data = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/refs/heads/master/games/tebakkata.json')
         const json = await Func.random(data)
         return {
            clue: json.soal,
            quest: json.jawaban.toLowerCase()
         }
      } catch (error) {
         console.error(error)
      }
   }

   initializeGame = async () => {
      try {
         this.quest = await this.getRandomQuest()
         this.maxAttempts = this.quest.quest.length
      } catch (error) {
         console.error(error)
      }
   }

   displayBoard = () => {
      const emojiStages = ['😐', '😕', '😟', '😧', '😢', '😨', '😵']
      let board = `*Current Stage:* ${emojiStages[this.currentStage]}\n\`\`\`==========\n|    |\n|   ${emojiStages[this.currentStage]}\n|   ${this.currentStage >= 3 ? '/' : ''}${this.currentStage >= 4 ? '|' : ''}${this.currentStage >= 5 ? '\\' : ''} \n|   ${this.currentStage >= 1 ? '/' : ''} ${this.currentStage >= 2 ? '\\' : ''} \n|      \n|      \n==========\`\`\`\n*Clue:* ${this.quest.clue}`
      return board
   }

   displayWord = () => this.quest.quest.split('').map((char) => (this.guesses.includes(char) ? `${char}` : '__')).join(' ')

   makeGuess = (letter) => {
      if (!this.isAlphabet(letter)) return 'invalid'
      letter = letter.toLowerCase()
      if (this.guesses.includes(letter)) return 'repeat'

      this.guesses.push(letter)

      if (!this.quest.quest.includes(letter)) {
         this.currentStage = Math.min(this.quest.quest.length, this.currentStage + 1)
      }

      return this.checkGameOver() ? 'over' : this.checkGameWin() ? 'win' : 'continue'
   }

   isAlphabet = (letter) => /^[a-zA-Z]$/.test(letter)

   checkGameOver = () => this.currentStage >= this.maxAttempts

   checkGameWin = () => [...new Set(this.quest.quest)].every((char) => this.guesses.includes(char))

   getHint = () => `*Hint* : ${this.quest.quest}`
}

module.exports = Hangman