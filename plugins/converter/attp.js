module.exports = {
   help: ['attp'],
   use: 'text',
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon bot'), m)
         if (text.length > 10) return conn.reply(m.chat, Func.texted('bold', '🚩 Max 10 character'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/attp', {
            text: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendSticker(m.chat, json.data.url, m, {
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