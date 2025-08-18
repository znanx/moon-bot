module.exports = {
   help: ['tagall'],
   use: 'text (optional)',
   tags: 'admin',
   run: async (m, {
      conn,
      text,
      participants,
      Func
   }) => {
      try {
         let member = participants.map(v => v.id)
         let readmore = String.fromCharCode(8206).repeat(4001)
         let message = (!text) ? 'Hello everyone, admin mention you in ' + await (await conn.groupMetadata(m.chat)).subject + ' group.' : text
         conn.reply(m.chat, `乂  *E V E R Y O N E*\n\n*“${message}”*\n${readmore}\n${member.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n')}`, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   admin: true,
   error: false
}