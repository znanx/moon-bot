module.exports = {
   help: ['tiktok', 'tikmp3', 'tikwm'],
   aliases: ['tt'],
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
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://www.tiktok.com/@cikaseiska/video/7379107227363200261?is_from_webapp=1&sender_device=pc&web_id=7330639260519974418')
         if (!args[0].match('tiktok.com')) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/tiktok', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         let teks = `乂  *T I K T O K*\n\n`
         teks += `   ∘  *Author* : ${json.author.nickname}\n`
         teks += `   ∘  *Like* : ${Func.formatNumber(json.stats.likes)}\n`
         teks += `   ∘  *Share* : ${Func.formatNumber(json.stats.share)}\n`
         teks += `   ∘  *Comment* : ${Func.formatNumber(json.stats.comment)}\n`
         teks += `   ∘  *Duration* : ${json.duration}\n`
         teks += `   ∘  *Sound* : ${json.music_info.title} - ${json.music_info.author}\n`
         teks += `   ∘  *Caption* : ${json.title}\n`
         teks += `   ∘  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         teks += global.footer
         if (command == 'tiktok' || command == 'tt') {
            let result = json.data.find(v => v.type == 'nowatermark')
            if (!result) {
               json.data.map(x => {
                  conn.sendFile(m.chat, x.url, Func.filename('jpg'), teks, m)
               })
            } else {
               conn.sendFile(m.chat, result.url, Func.filename('mp4'), teks, m)
            }
         } else if (command == 'tikwm') return conn.sendFile(m.chat, json.data.find(v => v.type == 'watermark').url, Func.filename('mp4'), teks, m)
         else if (command == 'tikmp3') return conn.sendFile(m.chat, json.music_info.url, Func.filename('mp3'), '', m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}