module.exports = {
   help: ['ephemeral', 'customid', 'stcai', 'stcprem'],
   tags: 'example',
   run: async (m, {
      conn,
      command
   }) => {
      switch (command) {
         case 'ephemeral': {
            /** 
             * 1 * 24 * 60 * 60 ~> 1 Day
             * 7 * 24 * 60 * 60 ~> 7 Day
             * 90 * 24 * 60 * 60 ~> 90 Day
            */
            conn.reply(m.chat, 'Hi!', null, {}, {
               ephemeral: 7 * 24 * 60 * 60 // 7days
            })
         }
         break
         
         case 'customid': {
            conn.reply(m.chat, 'Hi!', null, {}, {
               isAI: true
            })
         }
         break

         case 'stcai': {
            conn.sendSticker(m.chat, 'https://i.pinimg.com/1200x/4d/9e/29/4d9e29361d4dcdc6eabf5a0a035c900d.jpg', m, {
               packname: global.db.setting.packname,
               author: global.db.setting.author,
               mode: 'ai'
            })
         }
         break

         case 'stcprem': {
            conn.sendSticker(m.chat, 'https://i.pinimg.com/1200x/4d/9e/29/4d9e29361d4dcdc6eabf5a0a035c900d.jpg', m, {
               packname: global.db.setting.packname,
               author: global.db.setting.author,
               mode: 'premium'
            })
         }
         break
      }
   },
   error: false
}