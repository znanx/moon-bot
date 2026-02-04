module.exports = {
   help: ['tts'],
   use: 'iso text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      const defaultLang = 'id'
      try {
         if (!args[0]) throw Func.example(usedPrefix, command, 'id hello guys')
         let text = args.slice(1).join('')
         if ((args[0] || '').length !== 2) {
            lang = defaultLang
            text = args.join(' ')
         }
         if (!text && m.quoted && m.quoted.text) text = m.quoted.text
         const json = await Api.get('/canvas/tts', {
            text: text, iso: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, 'audio.mp3', '', m)
      } catch (e) {
         throw Func.texted('bold', `🚩 Language code not supported.`)
      }
   },
   limit: true,
   error: false
}