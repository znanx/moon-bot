module.exports = {
   help: ['emoji'],
   aliases: ['semoji'],
   use: 'emo',
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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'apple 😁'), m)
         let [type, ...rest] = text.split(' ')
         let data = rest.join(' ').trim()
         let lists = ['apple', 'google', 'facebook', 'twitter', 'samsung', 'microsoft', 'whatsapp', 'messenger', 'joypixels', 'openmoji', 'emojidex', 'htc', 'lg', 'mozilla', 'softbank', 'au-kddi']
         if (!type || !lists.includes(type.toLowerCase())) {
            let p = `Use this feature based on the styles below:\n\n`
            p += lists.sort().map((v, i) => `   ◦  ${usedPrefix + command} ${v}`).join('\n')
            p += `\n\n${global.footer}`
            return conn.reply(m.chat, p, m)
         }
         const json = await Api.get('/emoji', {
            emo: data
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         const result = json.data[type.toLowerCase()]
         if (!result) return conn.reply(m.chat, Func.texted('bold', '🚩 Emoji style not found!'), m)
         conn.sendSticker(m.chat, result.image, m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}