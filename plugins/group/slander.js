module.exports = {
   help: ['slander'],
   use: '@mention text',
   tags: 'group',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      if (!text) return
      let cm = copy(m)
      let who
      if (text.includes('@0')) who = '0@s.whatsapp.net'
      else if (m.isGroup) who = cm.participant = m.mentionedJid[0]
      else who = m.chat
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