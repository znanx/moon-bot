module.exports = {
   help: ['emojimix'],
   use: 'emoji + emoji',
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, '😳 + 😩'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let [emo1, emo2] = text.split` + `
         if (!emo1 || !emo2) return conn.reply(m.chat, Func.texted('bold', `🚩 Give 2 emoji to mix.`), m)
         const json = await Api.get('/emojimix', {
            emo1, emo2
         })
         if (!json.status) return conn.reply(m.chat, Func.texted('bold', `🚩 Emoji can't be mixed.`), m)
         conn.sendSticker(m.chat, json.data.url, m, {
            packname: setting.sk_pack,
            author: setting.sk_author,
            categories: [emo1, emo2]
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}