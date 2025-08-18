module.exports = {
   help: ['soundcloud'],
   use: 'query / link',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         conn.soundcloud = conn.soundcloud ? conn.soundcloud : {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.soundcloud?.[m.chat] === 'undefined') return conn.reply(m.chat, `🚩 The data has expired, please search again with *${usedPrefix + command}*.`, m)
            let idx = parseInt(text) - 1
            let data = conn.soundcloud[m.chat].list
            if (isNaN(idx) || !data[idx]) return conn.reply(m.chat, '🚩 Invalid Number!', m)
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/soundcloud-dl', {
               url: url
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.username + '.mp3', '', m, {
               document: true
            })
         } else if (/https?:\/\/(open\.)?spotify\.com\//i.test(text)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/soundcloud-dl', {
               url: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.username + '.mp3', '', m, {
               document: true
            })
         } else {
            if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'demi kau dan si buah hati'), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/spotify', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.soundcloud[m.chat] = {
               list: json.data.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.soundcloud[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *S P O T I F Y*\n\n`
            json.data.map((v, i) => {
               txt += `*${i + 1}*. ${v.title} - ${v.artist || 'unknown'}\n`
               txt += `◦ *Channel* : ${v.channel || 'Unknown'}\n`
               txt += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
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