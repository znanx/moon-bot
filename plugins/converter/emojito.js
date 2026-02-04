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
         if (!text) throw Func.example(usedPrefix, command, '😀')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/canvas/emojito', {
            emoji: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendSticker(m.chat, await Func.fetchBuffer(json.data.url), m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}