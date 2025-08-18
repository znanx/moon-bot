const moment = require('moment-timezone')

module.exports = {
   help: ['couple'],
   tags: 'group',
   run: async (m, {
      conn,
      participants
   }) => {
      let member = participants.map(u => u.jid || u.id)
      let now = new Date * 1
      var tag1 = member[Math.floor(member.length * Math.random())]
      var tag2 = member[Math.floor(member.length * Math.random())]
      if (tag1 == tag2) {
         for (let i = 0; i < 5; i++) {
            var tag1 = member[Math.floor(member.length * Math.random())]
            var tag2 = member[Math.floor(member.length * Math.random())]
            if (tag1 != tag2) {
               break
            }
         }
      }
      conn.reply(m.chat, `Random Best Couple : @${tag1.replace(/@.+/, '')} 💞 @${tag2.replace(/@.+/, '')}, New couple of the day may be chosen at _${moment(now).format('DD/MM/YYYY HH:mm')}._`)
   },
   group: true,
   error: false
}