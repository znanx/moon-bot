module.exports = {
   help: ['tahta'],
   aliases: ['hartatahta'],
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
         if (!text) throw Func.example(usedPrefix, command, 'dunia')
         if (text.length > 25) throw Func.texted('bold', '🚩 Max 25 character')
         conn.sendReact(m.chat, '🕒', m.key)
         const old = new Date()
         const json = await Api.get('/canvas/tahta', {
            text
         })
         if (!json.status) throw Func.texted('bold', `🚩 Failed to create tahta.`)
         return conn.sendFile(m.chat, json.data.url, '', `Process : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
