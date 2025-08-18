module.exports = {
   help: ['outsider'],
   use: '(option)',
   tags: 'admin',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      participants,
      Func
   }) => {
      try {
         let member = participants.filter(v => !v.admin).map(v => v.jid || v.id).filter(v => !v.startsWith('62') && v != conn.decodeJid(conn.user.id))
         if (!args || !args[0]) {
            if (member.length == 0) return conn.reply(m.chat, Func.texted('bold', `🚩 This group is clean from outsiders.`), m)
            let teks = `✅ *${member.length}* outsiders found, send *${usedPrefix + command} -y* to remove them.\n\n`
            teks += member.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n')
            conn.reply(m.chat, teks, m)
         } else if (args[0] == '-y') {
            for (let jid of member) {
               await Func.delay(2000)
               await conn.groupParticipantsUpdate(m.chat, [jid], 'remove')
            }
            await conn.reply(m.chat, Func.texted('bold', `🚩 Done, ${member.length} outsiders successfully removed.`), m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   admin: true,
   botAdmin: true,
   error: false
}