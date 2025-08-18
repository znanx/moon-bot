module.exports = {
   help: ['bisakah'],
   tags: 'random',
   run: async (m, {
      conn,
      text,
      Func
   }) => {
      if (!text) return m.reply(`Apanya yang bisa?`)
      conn.reply(m.chat, `*Pertanyaan:* ${m.text}\n*Jawaban:* ${Func.random(['Iya', 'Bisa', 'Tentu saja bisa', 'Tentu bisa', 'Sudah pasti', 'Sudah pasti bisa', 'Tidak', 'Tidak bisa', 'Tentu tidak', 'tentu tidak bisa', 'Sudah pasti tidak'])}`.trim(), m, m.mentionedJid ? {
         contextInfo: {
            mentionedJid: m.mentionedJid
         }
      } : {})
   },
   error: false
}