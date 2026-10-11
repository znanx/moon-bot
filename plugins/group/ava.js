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
         if (!text && !m.quoted && !(m.mentionedJid && m.mentionedJid[0])) return conn.reply(m.chat, `🚩 Mention or reply chat target.`, m)
         let user
         if (m.mentionedJid && m.mentionedJid[0]) {
            user = m.mentionedJid[0]
         } else if (m.quoted && m.quoted.sender) {
            user = m.quoted.sender
         } else if (text) {
            let raw = text.replace(/[\s()-]/g, '')
            let number = raw.startsWith('+') ? raw.slice(1) : (isNaN(raw) ? raw.split('@')[1] : raw)
            if (!number || isNaN(number)) return conn.reply(m.chat, `🚩 Invalid number.`, m)
            if (number.length > 15) return conn.reply(m.chat, `🚩 Invalid format.`, m)
            user = number + '@s.whatsapp.net'
         }
         if (!user) return conn.reply(m.chat, `🚩 Cannot detect user.`, m)
         if (user.includes('@lid')) {
            const participant = participants.find(p => p.id === user)
            if (!participant) return conn.reply(m.chat, `🚩 Cannot find user in group.`, m)
         }

         const pic = await Promise.race([
            conn.profilePictureUrl(user, 'image'),
            new Promise(resolve => setTimeout(() => resolve(null), 1200))
         ]).catch(() => null)

         if (!pic) {
            return conn.reply(m.chat, `🚩 He/She didn't put a profile picture.`, m)
         }

         return await conn.sendFile(m.chat, pic, '', '', m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true
}
