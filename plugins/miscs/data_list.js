const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')
module.exports = {
   help: ['listprem', 'listban', 'listblock', 'listchat'],
   tags: 'miscs',
   run: async (m, {
      conn,
      command,
      isOwner,
      Func
   }) => {
      try {
         if (command == 'listprem') {
            const data = Object.entries(global.db.users).filter(([_, data]) => data.premium)
            if (data.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 Empty data.`), m)
            let txt = `乂  *L I S T - P R E M*\n\n`
            txt += data.map(([jid, data]) => '   ┌  @' + jid.replace(/@.+/, '') + '\n   │  *Limit* : ' + Func.formatNumber(data.limit) + '\n   └  *Expired* : ' + Func.timeReverse(data.expired - new Date() * 1)).join('\n') + '\n\n'
            txt += global.footer
            conn.reply(m.chat, txt, m)
         } else if (command == 'listban') {
            const data = Object.entries(global.db.users).filter(([_, data]) => data.banned)
            if (data.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 Empty data.`), m)
            let txt = `乂  *L I S T - B A N N E D*\n\n`
            txt += data.map(([jid, _]) => '	◦ @' + jid.replace(/@.+/, '')).join('\n') + '\n\n'
            txt += global.footer
            conn.reply(m.chat, txt, m)
         } else if (command == 'listblock') {
            const blockList = typeof await (await conn.fetchBlocklist()) != 'undefined' ? await (await conn.fetchBlocklist()) : []
            if (blockList.length < 1) return m.reply(Func.texted('bold', `🚩 Data empty.`))
            let text = `乂 *L I S T - B L O C K*\n\n`
            text += blockList.map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  @${conn.decodeJid(v).replace(/@.+/, '')}`
               } else if (i == v.length - 1) {
                  return `└  ◦  @${conn.decodeJid(v).replace(/@.+/, '')}`
               } else {
                  return `│  ◦  @${conn.decodeJid(v).replace(/@.+/, '')}`
               }
            }).join('\n')
            m.reply(text + '\n\n' + global.footer)
         } else if (command == 'listchat') {
            if (!isOwner) return conn.reply(m.chat, global.status.owner, m)
            const data = Object.entries(global.db.chats).filter(([jid, _]) => jid.endsWith('.net'))
            if (data.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 Empty data.`), m)
            let txt = `乂  *L I S T - C H A T*\n\n`
            txt += data.sort((a, b) => b[1].lastseen - a[1].lastseen).map(([jid, data]) => '   ┌  @' + jid.replace(/@.+/, '') + '\n   │  *Chat* : ' + Func.formatNumber(data.chat) + '\n   └  *Lastchat* : ' + moment(data.lastseen).format('DD/MM/YY HH:mm:ss')).join('\n\n') + '\n\n'
            txt += global.footer
            conn.reply(m.chat, txt, m)
         }
      } catch (e) {
         console.log(e)
      }
   }
}