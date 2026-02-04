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
            if (typeof conn.soundcloud?.[m.chat] === 'undefined') throw `🚩 The data has expired, please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.soundcloud[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/downloader/soundcloud', {
               url: url
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.username + '.mp3', '', m, {
               document: true
            })
         } else if (/https?:\/\/(open\.)?spotify\.com\//i.test(text)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/downloader/soundcloud', {
               url: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.username + '.mp3', '', m, {
               document: true
            })
         } else {
            if (!text) throw Func.example(usedPrefix, command, 'demi kau dan si buah hati')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/soundcloud', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.soundcloud[m.chat] = {
               list: json.data.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.soundcloud[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *S O U N D C L O U D*\n\n`
            json.data.map((v, i) => {
               txt += `*${i + 1}*. ${v.title} - ${v.artist || 'unknown'}\n`
               txt += `◦ *Channel* : ${v.channel || 'Unknown'}\n`
               txt += `◦ *Link* : ${v.url}\n\n`
            }).join('\n\n')
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