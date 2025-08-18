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
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Ketiban sapi'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/artimimpi', { q: text })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         m.reply(`◦ *Mimipi* : ${text}\n◦ *Arti* : ${json.data.arti}\n◦ *Solusi* : ${json.data.solusi}`)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}