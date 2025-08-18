module.exports = {
   help: ['kbbg'],
   use: 'text',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'alay'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/kbbg', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data.description, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}