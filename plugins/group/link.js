module.exports = {
   help: ['link'],
   tags: 'group',
   run: async (m, {
      conn
   }) => {
      await conn.reply(m.chat, 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat)), m)
   },
   group: true,
   botAdmin: true,
   error: false
}