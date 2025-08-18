module.exports = {
   help: ['pindl'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://pin.it/1wu7KDR9a'))
         if (!args[0].match(/pin(?:terest)?(?:\.it|\.com)/)) return conn.reply(m.chat, global.status.invalid, m)
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/pin-dl', {
            url: args[0]
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         json.data.map(v => {
            if (v.type == 'image') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            if (v.type == 'video') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            if (v.type == 'gif') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m, {
               gif: true
            })
         })
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}