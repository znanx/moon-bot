module.exports = {
   help: ['q'],
   aliases: ['quoted'],
   use: 'reply chat',
   tags: 'group',
   run: async (m, {
      conn,
      store,
      Func
   }) => {
      try {
         if (!m.quoted) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply to message that contain quoted.`), m)
         const msg = await store.loadMessage(m.chat, m.quoted.id)
         if (msg.quoted === null) return conn.reply(m.chat, Func.texted('bold', `🚩 Message does not contain quoted.`), m)
         return conn.copyNForward(m.chat, msg.quoted.fakeObj)
      } catch (e) {
         conn.reply(m.chat, `🚩 Can't load message.`, m)
      }
   },
   error: false
}