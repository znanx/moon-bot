module.exports = {
   help: ['replyai'],
   tags: 'example',
   run: async (m, {
      conn
   }) => {
      conn.replyAI(m.chat, 'Hi!', m)
   },
   error: false
}