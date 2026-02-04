module.exports = {
   help: ['translate'],
   aliases: ['tr'],
   use: 'lang text',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) throw Func.example(usedPrefix, command, 'id Love You')
      conn.sendReact(m.chat, '🕒', m.key)
      if (text && m.quoted && m.quoted.text) {
         let lang = text.slice(0, 2)
         try {
            let data = m.quoted.text
            const result = await Api.get('/tools/translate', {
               text: data,
               iso: lang
            })
            conn.reply(m.chat, result.data.text, m)
         } catch {
            throw Func.texted('bold', '🚩 Language codes are not supported.')
         }
      } else if (text) {
         let lang = text.slice(0, 2)
         try {
            let data = text.substring(2).trim()
            const result = await Api.get('/tools/translate', {
               text: data,
               iso: lang
            })
            conn.reply(m.chat, result.data.text, m)
         } catch {
            throw Func.texted('bold', '🚩 Language codes are not supported.')
         }
      }
   },
   limit: true
}