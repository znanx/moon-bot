module.exports = {
   help: ['lyric'],
   aliases: ['lirik'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      users,
      Func
   }) => {
      try {
         if (!conn.lyric) conn.lyric = {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.lyric?.[m.chat] === 'undefined') throw `🚩 The data has expired, please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.lyric[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/lyric2-get', {
               url: url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.reply(m.chat, json.data.lirik, m)
         } else {
            if (!text) throw Func.example(usedPrefix, command, 'demi kau dan si buah hati')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/lyric2', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.lyric[m.chat] = {
               list: json.data.map(v => ({ url: v.result.relationships_index_url })),
               timer: setTimeout(() => {
                  delete conn.lyric[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *L Y R I C*\n\n`
            json.data.slice(0, 10).map((v, i) => {
               txt += `*${i + 1}.* ${v.result.full_title}\n`
               txt += `◦ *Artist* : ${v.result.artist_names}\n`
               txt += `◦ *Release* : ${v.result.release_date_for_display}\n\n`
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