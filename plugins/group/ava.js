module.exports = {
   help: ['ava'],
   use: 'mention or reply',
   tags: 'group',
   run: async (m, {
      conn,
      text,
      participants,
      Func
   }) => {
      try {
         if (!text && !m.quoted && !m.mentionedJid) return conn.reply(m.chat, `🚩 Mention or reply chat target.`, m)
         let user
         if (m.mentionedJid && m.mentionedJid[0]) {
            user = m.mentionedJid[0]
         } else if (m.quoted && m.quoted.sender) {
            user = m.quoted.sender
         } else if (text) {
            let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@`[1]) : text
            if (isNaN(number)) return conn.reply(m.chat, `🚩 Invalid number.`, m)
            if (number.length > 15) return conn.reply(m.chat, `🚩 Invalid format.`, m)
            user = number + '@s.whatsapp.net'
         }
         if (!user) return conn.reply(m.chat, `🚩 Cannot detect user.`, m)
         if (user.includes('@lid')) {
            const participant = participants.find(p => p.lid === user)
            if (participant && participant.id) {
               user = participant.id
            } else {
               return conn.reply(m.chat, `🚩 Cannot find user in group.`, m)
            }
         }
         var pic = false
         try {
            var pic = await conn.profilePictureUrl(user, 'image')
         } catch { } finally {
            if (!pic) return conn.reply(m.chat, `🚩 He/She didn't put a profile picture.`, m)
            conn.sendFile(m.chat, pic, '', '', m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true
}