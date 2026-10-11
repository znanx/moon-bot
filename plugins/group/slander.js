module.exports = {
   help: ['slander'],
   use: '@mention text',
   tags: 'group',
   run: async (m, {
      conn,
      text,
      participants,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.texted('bold', '🚩 Tag the person you want to slander'), m)
         let who

         if (text.includes('@0')) {
            who = '0@s.whatsapp.net'
         } else if (m.mentionedJid && m.mentionedJid[0]) {
            who = m.mentionedJid[0]
            if (who.includes('@lid')) {
               const participant = participants.find(p => p.id === who)
               if (!participant) return conn.reply(m.chat, Func.texted('bold', '🚩 Cannot find user in group'), m)
            }
         } else {
            return conn.reply(m.chat, Func.texted('bold', '🚩 Tag the person you want to slander'), m)
         }

         let sp = '@' + who.split`@`[0]
         let [fake, ...real] = text.split(sp)
         let content = real.join(sp)

         return await conn.fakeReply(m.chat, content.trimStart(), who, fake.trimEnd(), m.chat, {
            contextInfo: {
               mentionedJid: Func.mention(content.trim())
            }
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   error: false
}
