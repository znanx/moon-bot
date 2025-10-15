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
         const medias = json.data.map(v => ({
            url: v.url,
            type: v.type
         }))
         if (medias.length === 1) {
            const file = medias[0]
            conn.sendFile(m.chat, file.url, file.type === 'video' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            const album = medias.map(v => ({ url: v.url }))
            conn.sendAlbumMessage(m.chat, album, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}