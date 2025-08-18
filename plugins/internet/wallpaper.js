module.exports = {
   help: ['wallpaper'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'sunset'))
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/wallpaper', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         for (let i = 0; i < 3; i++) {
            let ran = Math.floor(json.data.length * Math.random())
            let cap = `乂  *W A L L P A P E R*\n\n`
            cap += `  ∘  *Size* : ` + json.data[ran].size + `\n`
            cap += `  ∘  *Dimension* : ` + json.data[ran].size + `\n`
            cap += `  ∘  *Keyword* : ` + json.data[ran].keywords + `\n\n`
            cap += global.footer
            conn.sendFile(m.chat, json.data[ran].url, '', cap, m)
            await Func.delay(3000)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}