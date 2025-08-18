module.exports = {
   help: ['nulis'],
   aliases: ['magernulis'],
   use: 'text',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'moon-bot'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/nulis', {
            text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendFile(m.chat, json.data.url, '', ``, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}