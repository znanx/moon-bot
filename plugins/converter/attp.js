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
         if (!text) throw Func.example(usedPrefix, command, 'moon bot')
         if (text.length > 10) throw Func.texted('bold', '🚩 Max 10 character')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/canvas/attp', {
            text: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendSticker(m.chat, json.data.url, m, {
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