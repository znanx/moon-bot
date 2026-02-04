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
         if (!text) throw Func.example(usedPrefix, command, 'apple 😁')
         let [type, ...rest] = text.split(' ')
         let data = rest.join(' ').trim()
         let lists = ['apple', 'google', 'facebook', 'twitter', 'samsung', 'microsoft', 'whatsapp', 'messenger', 'joypixels', 'openmoji', 'emojidex', 'htc', 'lg', 'mozilla', 'softbank', 'au-kddi']
         if (!type || !lists.includes(type.toLowerCase())) {
            let p = `Use this feature based on the styles below:\n\n`
            p += lists.sort().map((v, i) => `   ◦  ${usedPrefix + command} ${v}`).join('\n')
            p += `\n\n${global.footer}`
            throw p
         }
         const json = await Api.get('/canvas/emoji', {
            emo: data
         })
         if (!json.status) throw Func.jsonFormat(json)
         const result = json.data[type.toLowerCase()]
         if (!result) throw Func.texted('bold', '🚩 Emoji style not found!')
         conn.sendSticker(m.chat, result.image, m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}