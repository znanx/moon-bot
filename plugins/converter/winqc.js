module.exports = {
   help: ['winqc'],
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
         if (!text) throw Func.example(usedPrefix, command, 'just friend kok manggil sayang')
         if (text.length > 300) throw Func.texted('bold', '🚩 Teks terlalu panjang! maksimal 300 karakter.')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/canvas/wmp', {
            text: text.trim()
         })
         if (!json.status || !json.data?.url) throw Func.texted('bold', `🚩 ${json.msg}`)
         return conn.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 2,
   error: false
}
