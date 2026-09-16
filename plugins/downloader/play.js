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

         if (!yt.length) throw '🚩 Video not found'

         const json = await Api.get('/downloader/youtube', {
            url: yt[0].url
         })
         if (!json.status) throw Func.jsonFormat(json)

         const data = json.data
         const format = data.formats?.find(v => v.extension === 'mp3' && v.quality === '128kbps')
         if (!format) throw '🚩 Format MP3 128kbps not found'

         const task_id = format.task_token
         if (!task_id) throw '🚩 Task ID not found'

         let txt = `乂 *Y T - P L A Y*\n\n`
         txt += `   ∘  *Title* : ${data.title} \n`
         txt += `   ∘  *Size* : ${format.size} \n`
         txt += `   ∘  *Duration* : ${data.duration} \n`
         txt += `   ∘  *Quality* : ${format.quality} \n\n`
         txt += global.footer

         const chSize = Func.sizeLimit(format.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium
            ? `💀 File size(${format.size}) exceeds the maximum limit.`
            : `⚠️ File size(${format.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`

         if (chSize.oversize) throw isOver

         // Polling
         let result
         const maxAttempts = 60
         const interval = 2000

         for (
            let attempt = 0;
            attempt < maxAttempts;
            attempt++
         ) {
            const check = await Api.post('/downloader/youtube/check', {
               task_id
            })
            if (!check.status) throw `🚩 ${check.msg}`

            const status = check.data
            if (status.queue === 'completed' && status.url) {
               result = status
               break
            }

            if (status.queue === 'failed') throw '🚩 Failed to process'
            await new Promise(resolve => setTimeout(resolve, interval))
         }

         if (!result?.url) throw '🚩 The download took too long and exceeded the time limit'

         await conn.sendLinkPreview(m.chat, txt, m, {
            ratio: 'landscape',
            thumbnail: data.thumbnail
         })
         await conn.sendFile(m.chat, result.url, result.filename || `${data.title}.mp3`, '', m, {
            document: false,
            APIC: await Func.fetchBuffer(data.thumbnail)
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 2,
   error: false
}
