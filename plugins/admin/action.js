module.exports = {
   help: ['add', 'promote', 'demote', 'kick'],
   use: 'mention or reply',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      participants,
      Func
   }) => {
      const input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
      if (!input) return conn.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)
      const p = await conn.onWhatsApp(input.trim())
      if (!p.length) return conn.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      const jid = conn.decodeJid(p[0].jid)
      const number = jid.replace(/@.+/, '')
      if (command == 'kick') {
         let member = participants.find(v => v.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         if (jid === conn.user.id) return conn.reply(m.chat, Func.texted('bold', `🚩 Cannot kick the bot itself.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'remove').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'add') {
         // if (!isOwner) return conn.reply(m.chat, global.status.owner, m)
         let member = participants.find(v => v.id == jid)
         if (member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'add').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'demote') {
         let member = participants.find(v => v.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'demote').then(res => m.reply(Func.jsonFormat(res)))
      } else if (command == 'promote') {
         let member = participants.find(v => v.id == jid)
         if (!member) return conn.reply(m.chat, Func.texted('bold', `🚩 @${number} already left or does not exist in this group.`), m)
         conn.groupParticipantsUpdate(m.chat, [jid], 'promote').then(res => m.reply(Func.jsonFormat(res)))
      }
   },
   group: true,
   admin: true,
   botAdmin: true,
   error: false
}