module.exports = {
   run: async (m, {
      conn,
      body,
      groupSet,
      setting,
      isAdmin,
      isBotAdmin,
      Func
   }) => {
      try {
         if (groupSet.antitoxic && !isAdmin && isBotAdmin && !m.fromMe) {
            let toxic = setting.toxic
            if (body && (new RegExp('\\b' + toxic.join('\\b|\\b') + '\\b')).test(body.toLowerCase())) {
               groupSet.member[m.sender].warning += 1
               let warning = groupSet.member[m.sender].warning
               if (warning > 4) return conn.reply(m.chat, Func.texted('bold', `🚩 Warning : [ 5 / 5 ], good bye ~~`), m).then(() => {
                  conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(async () => {
                     groupSet.member[m.sender].warning = 0
                     conn.sendMessage(m.chat, {
                        delete: {
                           remoteJid: m.chat,
                           fromMe: isBotAdmin ? false : true,
                           id: m.key.id,
                           participant: m.sender
                        }
                     })
                  })
               })
               return conn.reply(m.chat, `乂  *W A R N I N G* \n\nYou got warning : [ ${warning} / 5 ]\n\If you get 5 warnings you will be kicked automatically from the group.`, m).then(() => conn.sendMessage(m.chat, {
                  delete: {
                     remoteJid: m.chat,
                     fromMe: isBotAdmin ? false : true,
                     id: m.key.id,
                     participant: m.sender
                  }
               }))
            }
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   error: false
}