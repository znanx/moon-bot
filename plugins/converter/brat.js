module.exports = {
   help: ['brat'],
   use: 'text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      text,
      setting,
      Func
   }) => {
      try {
         const mode = args[0] === 'gif' ? 'gif' : 'text'
         const content = mode === 'gif' ? args.slice(1).join(' ') : text.trim()
         if (!content) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon-bot'), m)
         if (content.length > 100) return conn.reply(m.chat, Func.texted('bold', '🚩 Text is too long, max 100 characters.'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         if (mode === 'gif') {
            const json = await Api.get('/bratgif', {
               text: content
            })
            const buffer = Buffer.from(json.data, 'base64')
            conn.sendSticker(m.chat, buffer, m, {
               packname: setting.sk_pack,
               author: setting.sk_author
            })
         } else {
            const json = await Api.get('/brat', {
               text: content
            })
            conn.sendSticker(m.chat, json.data.url, m, {
               packname: setting.sk_pack,
               author: setting.sk_author
            })
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}