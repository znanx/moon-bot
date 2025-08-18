module.exports = {
   help: ['sendcontact'],
   tags: 'anonymous',
   run: async (m, {
      conn,
      command,
      usedPrefix,
      text,
      Func
   }) => {
      try {
         conn.anonymous = conn.anonymous ? conn.anonymous : {}
         let who = m.sender
         let room = Object.values(conn.anonymous).find(room => room.check(who))
         if (!room) return conn.reply(m.chat, Func.texted('bold', 'You are not in anonymous chat'), m)
         let other = room.other(who)
         var name
         if (text) name = text
         else name = conn.getName(m.sender)
         var number = who.split('@')[0]
         let vcard = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${name.replace(/\n/g, '\\n')}
  TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
  END:VCARD`
         conn.reply(m.chat, Func.texted('bold', `You successfully sent a contact to your partner.`), m)
         if (other) conn.reply(other, Func.texted('bold', `Partner sends contact to you`), m)
         if (other) conn.sendMessage(other, {
            contacts: {
               displayName: name,
               contacts: [{ vcard }]
            }
         })
      } catch (e) {
         console.log(e)
      }
   },
   private: true,
   error: false
}