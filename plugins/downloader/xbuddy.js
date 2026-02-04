module.exports = {
   help: ['xbuddy'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      users,
      env,
      Func
   }) => {
      try {
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://www.tiktok.com/@cikaseiska/video/7379107227363200261?is_from_webapp=1&sender_device=pc&web_id=7330639260519974418')
         if (!/^https?:\/\//.test(args[0])) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key), old = new Date()
         const json = await Api.get('/downloader/9xbuddy', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         const result = json.data.response.formats.filter(v => v.type === 'video').map(v => v.url)
         if (result.length > 0) {
            conn.sendFile(m.chat, result[0], '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else { }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 5,
   error: false
}