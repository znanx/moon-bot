module.exports = {
   help: ['ava'],
   use: 'mention or reply',
   tags: 'group',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@`[1]) : text
      if (!text && !m.quoted) return conn.reply(m.chat, `🚩 Mention or reply chat target.`, m)
      if (isNaN(number)) return conn.reply(m.chat, `🚩 Invalid number.`, m)
      if (number.length > 15) return conn.reply(m.chat, `🚩 Invalid format.`, m)
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) { } finally {
         var pic = false
         try {
            var pic = await conn.profilePictureUrl(user, 'image')
         } catch { } finally {
            if (!pic) return conn.reply(m.chat, `He/She didn't put a profile picture.`, m)
            conn.sendFile(m.chat, pic, '', '', m)
         }
      }
   },
   group: true,
   error: false
}