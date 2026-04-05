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
            if (typeof conn.spotify?.[m.chat] === 'undefined') throw `🚩 The data has expired, please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.spotify[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/downloader/spotify', {
               url: url
            })
            if (!json.status) throw Func.jsonFormat(json)
            let txt = `乂  *S P O T I F Y*\n\n`
            txt += `   ◦  *Title* : ${json.data.title}\n`
            txt += `   ◦  *Artist* : ${json.data.artist}\n`
            txt += `   ◦  *Duration* : ${json.data.duration}\n\n`
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
            const json = await Api.get('/downloader/spotify', {
               url: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            let txt = `乂  *S P O T I F Y*\n\n`
            txt += `   ◦  *Title* : ${json.data.title}\n`
            txt += `   ◦  *Artist* : ${json.data.artist}\n`
            txt += `   ◦  *Duration* : ${json.data.duration}\n\n`
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
            if (!text) throw Func.example(usedPrefix, command, 'demi kau dan si buah hati')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/spotify', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.spotify[m.chat] = {
               list: json.data.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.spotify[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *S P O T I F Y*\n\n`
            txt += json.data.map((item, i) => {
               const detail = Object.entries(item)
                  .filter(([key]) => key !== 'title')
                  .map(([key, value]) => `◦ *${key}* : ${value}`)
                  .join('\n')
               return `*${i + 1}.* ${item.title}\n${detail}`
            }).join('\n\n')
            txt += '\n\n' + `Type a number ( 1 - 10 ) to see details.`
            conn.reply(m.chat, txt, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}