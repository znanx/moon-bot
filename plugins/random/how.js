module.exports = {
   help: ['howgay', 'howpintar', 'howcantik', 'howganteng', 'howgabut', 'howgila', 'howlesbi', 'howstress', 'howbucin', 'howjones', 'howsadboy'],
   use: 'text',
   tags: 'random',
   run: async (m, {
      conn,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(`Siapa yang *${command.replace('how', '').toUpperCase()}*`)
         conn.reply(m.chat, `${command} *${text}* is *${Math.floor(Math.random() * 101)}*% ${command.replace('how', '').toUpperCase()}`.trim(), m, m.mentionedJid ? {
            contextInfo: {
               mentionedJid: m.mentionedJid
            }
         } : {})
      } catch (e) {
         console.log(e)
      }
   },
   error: false
}