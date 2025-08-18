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
            if (typeof conn.chord?.[m.chat] === 'undefined') return conn.reply(m.chat, `🚩 The data has expired. Please search again with *${usedPrefix + command}*.`, m)
            let idx = parseInt(text) - 1
            let data = conn.chord[m.chat].list
            if (isNaN(idx) || !data[idx]) return conn.reply(m.chat, '🚩 Invalid Number!', m)
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/chord-get', {
               url: url
            })
            conn.reply(m.chat, json.data.chord, m)
         } else {
            if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'demi kau dan si buah hati'), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/chord', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
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
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}