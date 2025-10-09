const { createHash } = require('crypto')

module.exports = {
   help: ['unreg'],
   aliases: ['unregister'],
   use: 'sn',
   tags: 'user',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) throw Func.example(usedPrefix, command, '31j3h1oh23423p')
         let users = global.db.users[m.sender]
         let sn = createHash('md5').update(m.sender).digest('hex')
         if (args[0] !== sn) throw Func.texted('bold', '🚩 Wrong / invalid serial number.')

         let now = Date.now()
         let diff = now - users.reg_time
         let limit = 72 * 60 * 60 * 1000 // 72 hours

         if (diff < limit) {
            const remaining = limit - diff
            const hours = Math.floor(remaining / (60 * 60 * 1000))
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
            throw Func.texted('bold', `🚩 You can unregister after ${hours}h ${minutes}m.`)
         }

         conn.reply(m.chat, '✅ Successfully unregistered', m).then(() => {
            users.registered = false
            users.reg_time = 0
            users.age = 0
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   private: true,
   register: true
}