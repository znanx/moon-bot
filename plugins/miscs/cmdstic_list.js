const moment = require('moment-timezone')

module.exports = {
   help: ['cmdstic'],
   tags: 'owner',
   run: async (m, {
      conn,
      Func
   }) => {
      let cmdS = Object.keys(global.db.sticker)
      if (cmdS.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 No sticker commands.`), m)
      let teks = `乂  *C M D - L I S T*\n\n`
      for (let i = 0; i < cmdS.length; i++) {
         teks += Func.texted('bold', (i + 1) + '.') + ' ' + cmdS[i] + '\n'
         teks += '	◦  ' + Func.texted('bold', 'Text') + ' : ' + global.db.stickerr[cmdS[i]].text + '\n'
         teks += '	◦  ' + Func.texted('bold', 'Created') + ' : ' + moment(global.db.sticker[cmdS[i]].created).format('DD/MM/YY HH:mm:ss') + '\n\n'
      }
      m.reply(teks + global.footer)
   },
   error: false
}