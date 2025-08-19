const init = new (require('./init'))
const { models } = require('./models')

module.exports = (m, env) => {
   const user = global.db.users[m.sender]
   if (user) {
      init.execute(user, models.users, {
         lid: m.sender?.endsWith('lid') ? m.sender : null,
         name: m.pushName,
         limit: 10,
      })
   } else {
      global.db.users[m.sender] = {
         lid: m.sender?.endsWith('lid') ? m.sender : null,
         name: m.pushName,
         limit: 10,
         ...(init.getModel(models?.users || {}))
      }
   }

   if (m.isGroup) {
      const group = global.db.groups[m.chat]
      if (group) {
         init.execute(group, models.groups)
      } else {
         global.db.groups[m.chat] = {
            ...(init.getModel(models?.groups || {}))
         }
      }
   }

   const chat = global.db.chats[m.chat]
   if (chat) {
      init.execute(chat, models.chats)
   } else {
      global.db.chats[m.chat] = {
         ...(init.getModel(models?.chats || {}))
      }
   }

   let setting = global.db.setting
   if (setting && Object.keys(setting).length < 1) {
      init.execute(setting, models.setting)
   } else {
      setting = {
         ...(init.getModel(models?.setting || {}))
      }
   }
}