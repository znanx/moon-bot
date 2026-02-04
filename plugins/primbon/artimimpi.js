module.exports = {
   help: ['artimimpi'],
   use: 'query',
   tags: 'primbon',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'Ketiban sapi')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/primbon/artimimpi', { q: text })
         if (!json.status) throw Func.jsonFormat(json)
         m.reply(`◦ *Mimipi* : ${text}\n◦ *Arti* : ${json.data.arti}\n◦ *Solusi* : ${json.data.solusi}`)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: true
}