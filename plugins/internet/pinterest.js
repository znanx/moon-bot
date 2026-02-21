module.exports = {
   help: ['pinterest'],
   aliases: ['pin'],
   use: 'query / url',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'https://pin.it/5fXaAWE')
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         if (Func.isUrl(text.trim())) {
            if (!text.match(/pin(?:terest)?(?:\.it|\.com)/)) throw global.status.invalid
            const json = await Api.get('/downloader/pinterest', {
               url: text.trim()
            })
            if (!json.status) throw `🚩 ${json.msg}`
            json.data.result.map(v => {
               return conn.sendFile(m.chat, v.url, v.type === 'image'
                  ? Func.filename('jpg') : v.type === 'gif'
                     ? Func.filename('gif') : v.type === 'video'
                        ? Func.filename('mp4') : '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m, v.type === 'gif' ? { gif: true } : {})
            })
         } else {
            const json = await Api.get('/searching/pinterest', {
               q: text.trim()
            })
            var media = []
            if (!json.status) throw json.msg
            for (let i = 0; i < 5; i++) {
               var rand = Math.floor(json.data.length * Math.random())
               media.push({
                  url: json.data[rand].url
               })
            }
            conn.sendAlbumMessage(m.chat, media, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}