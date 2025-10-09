const moment = require('moment-timezone')

module.exports = {
   help: ['botstat'],
   aliases: ['stat', 'status'],
   tags: 'miscs',
   run: async (m, {
      conn,
      setting,
      plugins,
      Func
   }) => {
      try {
         const blockList = typeof await (await conn.fetchBlocklist()) != 'undefined' ? await (await conn.fetchBlocklist()) : []
         let users = Object.entries(global.db.users)
         let chats = Object.keys(global.db.chats)
         let groups = Object.keys(global.db.groups)
         class Hit extends Array {
            total(key) {
               return this.reduce((a, b) => a + (b[key] || 0), 0)
            }
         }
         let sum = new Hit(...Object.values(global.db.statistic))
         const stats = {
            users: users.length,
            chats: chats.filter(v => v.endsWith('.net')).length,
            groups: groups.filter(v => v.endsWith('g.us')).length,
            banned: users.filter(([_, v]) => v.banned).length,
            blocked: blockList.length,
            premium: users.filter(([_, v]) => v.premium).length,
            cmd: plugins.size,
            hitstat: sum.total('hitstat') != 0 ? sum.total('hitstat') : 0,
            uptime: Func.toTime(process.uptime() * 1000),
         }
         conn.sendMessageModify(m.chat, statistic(Func, stats, setting), m, {
            largeThumb: true,
            thumbnail: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
         })
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false
}

const statistic = (Func, stats, system) => {
   return `乂  *B O T S T A T*

   ◦  ${Func.texted('bold', Func.formatNumber(stats.groups))} Groups Joined
   ◦  ${Func.texted('bold', Func.formatNumber(stats.chats))} Personal Chats
   ◦  ${Func.texted('bold', Func.formatNumber(stats.users))} Users In Database
   ◦  ${Func.texted('bold', Func.formatNumber(stats.banned))} Users Banned
   ◦  ${Func.texted('bold', Func.formatNumber(stats.blocked))} Users Blocked
   ◦  ${Func.texted('bold', Func.formatNumber(stats.premium))} Premium Users
   ◦  ${Func.texted('bold', Func.formatNumber(stats.hitstat))} Commands Hit
   ◦  ${Func.texted('bold', Func.formatter(stats.cmd))} Available Commands
   ◦  Runtime : ${Func.texted('bold', stats.uptime)}

乂  *S Y S T E M*

   ◦  ${Func.texted('bold', system.antispam ? '[ √ ]' : '[ × ]')}  Anti Spam
   ◦  ${Func.texted('bold', system.anticall ? '[ √ ]' : '[ × ]')}  Anti Call
   ◦  ${Func.texted('bold', system.autobackup ? '[ √ ]' : '[ × ]')}  Auto Backup
   ◦  ${Func.texted('bold', system.notifier ? '[ √ ]' : '[ × ]')}  Notification
   ◦  ${Func.texted('bold', system.autodownload ? '[ √ ]' : '[ × ]')}  Auto Download
   ◦  ${Func.texted('bold', system.debug ? '[ √ ]' : '[ × ]')}  Debug Mode
   ◦  ${Func.texted('bold', system.groupmode ? '[ √ ]' : '[ × ]')}  Group Mode
   ◦  ${Func.texted('bold', system.privatemode ? '[ √ ]' : '[ × ]')}  Private Mode
   ◦  ${Func.texted('bold', system.online ? '[ √ ]' : '[ × ]')}  Always Online
   ◦  ${Func.texted('bold', system.noprefix ? '[ √ ]' : '[ × ]')}  No Prefix
   ◦  ${Func.texted('bold', system.self ? '[ √ ]' : '[ × ]')}  Self Mode
   ◦  ${Func.texted('bold', system.game ? '[ √ ]' : '[ × ]')}  Game Mode
   ◦  Prefix : ${Func.texted('bold', '( ' + system.prefix.map(v => v).join(' ') + ' )')}
   ◦  Reset At : ${moment(system.lastReset).format('DD/MM/YYYY HH:mm')}

${global.footer}`
}