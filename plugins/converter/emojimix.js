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
         if (!text) throw Func.example(usedPrefix, command, '😳 + 😩')
         conn.sendReact(m.chat, '🕒', m.key)
         let [emo1, emo2] = text.split` + `
         if (!emo1 || !emo2) throw Func.texted('bold', `🚩 Give 2 emoji to mix.`)
         const json = await Api.get('/canvas/emojimix', {
            emo1, emo2
         })
         if (!json.status) throw Func.texted('bold', `🚩 Emoji can't be mixed.`)
         conn.sendSticker(m.chat, json.data.url, m, {
            packname: setting.sk_pack,
            author: setting.sk_author,
            categories: [emo1, emo2]
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}