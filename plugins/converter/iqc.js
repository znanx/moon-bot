module.exports = {
   help: ['iqc'],
   use: 'text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'moonbot')
         if (text.length > 50) throw Func.texted('bold', '🚩 Text is too long, max 50 characters.')
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/converter/iqc', {
            text: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.sendFile(m.chat, json.data.url, Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 1,
   error: false
}