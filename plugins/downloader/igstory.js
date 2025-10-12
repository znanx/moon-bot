module.exports = {
   help: ['igstory'],
   aliases: ['igs'],
   use: 'link / username',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://instagram.com/stories/pandusjahrir/3064777897102858938?igshid=MDJmNzVkMjY=')
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/igs', {
            q: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         json.data.map(async (v, i) => {
            conn.sendFile(m.chat, v.url, v.type == 'video' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms (${i + 1})`, m)
            await Func.delay(1500)
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}