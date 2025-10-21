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
      if (!text) return
      let cm = copy(m)
      let who

      if (text.includes('@0')) {
         who = '0@s.whatsapp.net'
      } else if (m.isGroup && m.mentionedJid && m.mentionedJid[0]) {
         who = m.mentionedJid[0]

         if (who.includes('@lid')) {
            const participant = participants.find(p => p.lid === who)
            if (participant && participant.id) {
               who = participant.id
            } else {
               return conn.reply(m.chat, Func.texted('bold', '🚩 Cannot find user in group'), m)
            }
         }
         cm.participant = who
      } else {
         who = m.chat
      }

      if (!who) return conn.reply(m.chat, Func.texted('bold', '🚩 Tag the person you want to slander'), m)

      cm.key.fromMe = false
      cm.message[m.mtype] = copy(m.msg)

      let sp = '@' + who.split`@`[0]
      let [fake, ...real] = text.split(sp)

      conn.fakeReply(m.chat, real.join(sp).trimStart(), who, fake.trimEnd(), m.isGroup ? m.chat : false, {
         contextInfo: {
            mentionedJid: Func.mention(real.join(sp).trim())
         }
      })
   },
   group: true,
   error: false
}

function copy(obj) {
   return JSON.parse(JSON.stringify(obj))
}