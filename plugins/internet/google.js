module.exports = {
   help: ['google', 'gimage'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'Cow')
         conn.sendReact(m.chat, '🕒', m.key)
         if (command == 'google') {
            const json = await Api.get('/google', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            let txt = `乂  *G O O G L E*\n\n`
            json.data.map((v, i) => {
               txt += `*` + (i + 1) + `.* ` + v.title + `\n`
               txt += `  ∘  *Snippet* : ` + v.snippet + `\n`
               txt += `  ∘  *Link* : ` + v.url + `\n\n`
            })
            conn.reply(m.chat, txt, m)
         }
         if (command == 'gimage') {
            const json = await Api.get('/google-image', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            for (let i = 0; i < 5; i++) {
               let random = Math.floor(json.data.length * Math.random())
               let caption = `乂  *G O O G L E - I M A G E*\n\n`
               caption += `  ◦  *Title* : ${json.data[random].origin.title}\n`
               caption += `  ◦  *Dimensions* : ${json.data[random].width} × ${json.data[random].height}\n\n`
               caption += global.footer
               conn.sendFile(m.chat, json.data[random].url, 'google.jpg', caption, m)
               await Func.delay(2500)
            }
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}