module.exports = {
   help: ['apk'],
   use: 'query',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      isPrem,
      Func
   }) => {
      try {
         conn.apk = conn.apk ? conn.apk : {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.apk?.[m.chat] === 'undefined') return conn.reply(m.chat, `🚩 The data has expired, please search again with *${usedPrefix + command}*.`, m)
            let idx = parseInt(text) - 1
            let data = conn.apk[m.chat].list
            if (isNaN(idx) || !data[idx]) return conn.reply(m.chat, '🚩 Invalid Number!', m)
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/playstore-get', {
               url: url
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            let txt = `乂  *A P K*\n\n`
            txt += '   ◦  *Name* : ' + json.data.title + '\n'
            txt += '   ◦  *Size* : ' + json.data.downloadLinks[0].size + '\n'
            txt += '   ◦  *Version* : ' + json.data.version + '\n'
            txt += '   ◦  *Update* : ' + json.data.update + '\n'
            txt += '   ◦  *Requirement* : ' + json.data.requirement + '\n'
            txt += '   ◦  *Developer* : ' + json.data.developer + '\n\n'
            txt += global.footer
            const chSize = Func.sizeLimit(json.data.downloadLinks[0].size, isPrem ? env.max_upload : env.max_upload_free)
            const isOver = isPrem ? `💀 File size (${json.data.downloadLinks[0].size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.data.downloadLinks[0].url))}` : `⚠️ File size (${json.data.downloadLinks[0].size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
            if (chSize.oversize) return conn.reply(m.chat, isOver, m)
            conn.sendMessageModify(m.chat, txt, m, {
               largeThumb: true,
               thumbnail: json.data.img
            }).then(async () => {
               await conn.sendFile(m.chat, json.data.downloadLinks[0].url, json.data.downloadLinks[0].filename, '', m)
            })
         } else {
            if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'demi kau dan si buah hati'), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/playstore', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.apk[m.chat] = {
               list: json.data.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.apk[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *A P K*\n\n`
            json.data.slice(0, 10).map((v, i) => {
               txt += `*${i + 1}.* ${v.title}\n`
               txt += `◦ *Rating* : ${v.rating}\n`
               txt += `◦ *Developer* : ${v.developer}\n\n`
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