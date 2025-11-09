module.exports = {
   help: ['ephemeral', 'customid'],
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
      }
   },
   error: false
}