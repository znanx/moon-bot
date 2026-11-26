const { clearUserAudio } = require('../../lib/soundSticker')

module.exports = {
   help: ['csa'],
   aliases: ['clearaudio', 'clearsavedaudio'],
   tags: 'converter',
   run: async (m, {
      conn,
      Func
   }) => {
      const removed = clearUserAudio(conn, m.sender)
      if (!removed) {
         return conn.reply(m.chat, Func.texted('bold', '🚩 You have no saved audio to clear.'), m)
      }
      return conn.reply(m.chat, Func.texted('bold', '🚩 Your saved audio has been cleared.'), m)
   },
   error: false
}
