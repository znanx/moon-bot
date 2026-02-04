module.exports = {
   help: ['chord'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!conn.chord) conn.chord = {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.chord?.[m.chat] === 'undefined') throw `🚩 The data has expired. Please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.chord[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/chord/get', {
               url: url
            })
            conn.reply(m.chat, json.data.chord, m)
         } else {
            if (!text) throw Func.example(usedPrefix, command, 'demi kau dan si buah hati')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/chord', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.chord[m.chat] = {
               list: json.data,
               timer: setTimeout(() => {
                  delete conn.chord[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *C H O R D*\n\n`
            json.data.slice(0, 10).map((v, i) => {
               txt += `*${i + 1}.* ${v.title}\n`
            }).join('\n')
            txt += `Type a number ( 1 - 10 ) to see details.`
            conn.reply(m.chat, txt, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}