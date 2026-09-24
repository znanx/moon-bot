module.exports = {
   help: ['ytmp4'],
   aliases: ['ytv'],
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
         if (!args[0]) {
            throw Func.example(
               usedPrefix,
               command,
               'https://youtu.be/zaRFmdtLhQ8'
            )
         }

         if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
            throw global.status.invalid
         }

         conn.sendReact(m.chat, '🕒', m.key)

         const response = await Api.get('/downloader/youtube', {
            url: args[0]
         })

         if (!response.status) {
            throw response.msg || 'Failed to request the download.'
         }

         const { data } = response

         const format = data.formats?.find(v => v.quality === '480p')
            || data.formats?.find(v => v.quality === '360p')

         if (!format?.task_token) {
            throw 'MP4 format is unavailable.'
         }

         const limit = users.premium
            ? env.max_upload
            : env.max_upload_free

         if (Func.sizeLimit(format.size, limit).oversize) {
            throw users.premium
               ? `File size (${format.size}) exceeds the maximum limit.`
               : `File size (${format.size}) exceeds your ${env.max_upload_free} MB upload limit.`
         }

         let caption = `乂  *Y T - M P 4*\n\n`
         caption += `   ◦  *Title* : ${data.title}\n`
         caption += `   ◦  *Duration* : ${data.duration}\n`
         caption += `   ◦  *Views* : ${data.views}\n`
         caption += `   ◦  *Size* : ${format.size}\n`
         caption += `   ◦  *Quality* : ${format.quality}\n\n`
         caption += global.footer

         let result

         for (let attempt = 0; attempt < 60; attempt++) {
            const check = await Api.post('/downloader/youtube/check', {
               task_id: format.task_token
            })

            if (!check.status) {
               throw check.msg || 'Failed to check download status.'
            }

            const { queue, url, filename } = check.data

            if (queue === 'completed' && url) {
               result = {
                  url,
                  filename
               }
               break
            }

            if (queue === 'failed') {
               throw 'Download failed.'
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
         }

         if (!result) {
            throw 'Download timed out.'
         }

         await conn.sendFile(
            m.chat,
            result.url,
            result.filename || `${data.title}.mp4`,
            caption,
            m
         )
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },

   limit: true,
   error: false
}
