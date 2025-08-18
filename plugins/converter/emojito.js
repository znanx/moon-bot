module.exports = {
   help: ['emojito'],
   use: 'emoji',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '😀'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/emojito', {
            emoji: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendSticker(m.chat, await Func.fetchBuffer(json.data.url), m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}