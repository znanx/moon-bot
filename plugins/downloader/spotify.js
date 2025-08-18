module.exports = {
   help: ['spotify'],
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
         conn.spotify = conn.spotify ? conn.spotify : {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.spotify?.[m.chat] === 'undefined') return conn.reply(m.chat, `🚩 The data has expired, please search again with *${usedPrefix + command}*.`, m)
            let idx = parseInt(text) - 1
            let data = conn.spotify[m.chat].list
            if (isNaN(idx) || !data[idx]) return conn.reply(m.chat, '🚩 Invalid Number!', m)
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/spotify-dl', {
               url: url
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            let txt = `乂  *S P O T I F Y*\n\n`
            txt += `   ◦  *Title* : ${json.data.title}\n`
            txt += `   ◦  *Artist* : ${json.data.artist}\n`
            txt += `   ◦  *Duration* : ${json.data.duration}\n`
            txt += `   ◦  *Publish* : ${json.data.publish}\n\n`
            txt += global.footer
            conn.sendMessageModify(m.chat, txt, m, {
               largeThumb: true,
               thumbnail: json.data.thumbnail
            }).then(async () => {
               conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.artist + '.mp3', '', m, {
                  document: true,
                  APIC: await Func.fetchBuffer(json.data.thumbnail)
               })
            })
         } else if (/https?:\/\/(open\.)?spotify\.com\//i.test(text)) {
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/spotify-dl', {
               url: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            let txt = `乂  *S P O T I F Y*\n\n`
            txt += `   ◦  *Title* : ${json.data.title}\n`
            txt += `   ◦  *Artist* : ${json.data.artist}\n`
            txt += `   ◦  *Duration* : ${json.data.duration}\n`
            txt += `   ◦  *Publish* : ${json.data.publish}\n\n`
            txt += global.footer
            conn.sendMessageModify(m.chat, txt, m, {
               largeThumb: true,
               thumbnail: json.data.thumbnail
            }).then(async () => {
               conn.sendFile(m.chat, json.data.url, json.data.title + ' - ' + json.data.artist + '.mp3', '', m, {
                  document: true,
                  APIC: await Func.fetchBuffer(json.data.thumbnail)
               })
            })
         } else {
            if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'demi kau dan si buah hati'), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/spotify', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.spotify[m.chat] = {
               list: json.data.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.spotify[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *S P O T I F Y*\n\n`
            json.data.map((v, i) => {
               txt += `*${i + 1}.* ${v.title}\n`
               txt += `◦ *Publish* : ${v.release_date}\n`
               txt += `◦ *Duration* : ${v.duration}\n`
               txt += `◦ *Popularity* : ${v.popularity}\n`
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