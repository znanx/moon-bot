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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://pin.it/1wu7KDR9a')
         if (!args[0].match(/pin(?:terest)?(?:\.it|\.com)/)) throw global.status.invalid
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/pinterest', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         json.data.map(v => {
            if (v.type == 'image') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            if (v.type == 'video') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            if (v.type == 'gif') return conn.sendFile(m.chat, v.url, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m, {
               gif: true
            })
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}