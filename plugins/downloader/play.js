const yts = require('yt-search')
module.exports = {
   help: ['play'],
   use: 'query',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      users,
      env,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'Dewi')
         conn.sendReact(m.chat, '🕒', m.key)
         const ys = await (await yts(text)).all
         const yt = ys.filter(p => p.type == 'video')
         const json = await Api.get('/downloader/youtube', {
            url: yt[0].url, type: 'mp3'
         })
         if (!json.status) throw Func.jsonFormat(json)
         let txt = `乂  *Y T - P L A Y*\n\n`
         txt += `   ∘  *Title* : ` + json.data.title + `\n`
         txt += `   ∘  *Size* : ` + json.data.size + `\n`
         txt += `   ∘  *Duration* : ` + json.data.duration + `\n`
         txt += `   ∘  *Quality* : ` + json.data.quality + '\n\n'
         txt += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) throw isOver
         conn.sendLinkPreview(m.chat, txt, m, {
            ratio: 'landscape', // landscape (default), potrait, square */
            thumbnail: json.data.thumbnail,
         }).then(async () => {
            conn.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
               document: false,
               APIC: await Func.fetchBuffer(json.data.thumbnail)
            })
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
