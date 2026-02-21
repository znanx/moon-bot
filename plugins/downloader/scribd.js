module.exports = {
   help: ['scribd'],
   use: 'link / query',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         conn.scribd = conn.scribd ? conn.scribd : {}
         if (!args[0]) throw Func.example(usedPrefix, command, 'https://www.scribd.com/document/606202664/CONTOH-POWERPOINT-PKL')

         if (/^\d+$/.test(args[0])) {
            const store = conn.scribd[m.chat]
            if (!store) throw 'Search data expired, please search again'

            const idx = parseInt(args[0]) - 1
            const item = store.list[idx]
            if (!item) throw 'Invalid number'

            args[0] = item.url
         } else if (!/scribd\.com/i.test(args[0])) {
            const q = args.join(' ')
            conn.sendReact(m.chat, '🕒', m.key)

            const json = await Api.get('/searching/scribd', { q })
            if (!json.status) throw Func.jsonFormat(json)

            const docs = json?.data?.documents ?? []
            if (!docs.length) throw 'No documents found'

            conn.scribd[m.chat] = {
               list: docs.slice(0, 10).map(v => ({ url: v.reader_url })),
               timer: setTimeout(() => delete conn.scribd[m.chat], 2 * 60 * 1000)
            }

            let text = '乂  *S C R I B D*\n\n'
            docs.slice(0, 10).forEach((v, i) => {
               text += `*${i + 1}.* ${v.title}\n`
               text += `◦ Author : ${v.author?.name || '-'}\n`
               text += `◦ Pages  : ${v.pageCount}\n`
               text += `◦ Views  : ${v.views}\n\n`
            })

            text += 'Reply with a number (1–10) to download'
            return conn.reply(m.chat, text, m)
         }

         if (!args[0].match(/scribd\.com/i)) throw global.status.invalid

         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/scribd', {
            url: args[0]
         })

         if (!json.status) throw Func.jsonFormat(json)

         const media = json?.data?.images ?? []
         if (!media.length) throw 'No media found'

         if (media.length === 1) {
            return conn.sendFile(m.chat, media[0].url, Func.filename('jpg'), `◦ *Title* : ${json.data.title}`, m)
         }

         const album = media.map(v => ({ url: v.url }))
         return conn.sendAlbumMessage(m.chat, album, m)

      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}