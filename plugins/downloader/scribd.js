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

            let text = 'To download, send .scribd 1-10 in the order of the results\n\n'
            docs.slice(0, 10).forEach((v, i) => {
               text += `*${i + 1}.* ${v.title}\n`
               text += `◦ Author : ${v.author?.name || '-'}\n`
               text += `◦ Pages  : ${v.pageCount}\n`
               text += `◦ Views  : ${v.views}\n\n`
            })
            return conn.reply(m.chat, text, m)
         }

         if (!args[0].match(/scribd\.com/i)) throw global.status.invalid

         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/downloader/scribd', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)

         let download = json?.data?.download?.data?.url
         let capt = `◦ *Title* : ${json.data.documentInfo[0].doc.title}\n`
         capt += `◦ *Publisher* : ${json.data.documentInfo[0].doc.publisher.name} - ${json.data.documentInfo[0].doc.publisher.username}`

         return conn.sendFile(m.chat, download, '', capt, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
