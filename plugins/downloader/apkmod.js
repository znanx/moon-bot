module.exports = {
   help: ['apkmod'],
   use: 'query',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      isPrem,
      users,
      env,
      Scraper,
      Func
   }) => {
      try {
         conn.apkmod = conn.apkmod ? conn.apkmod : {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.apkmod?.[m.chat] === 'undefined') throw `🚩 The data has expired, please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.apkmod[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            const { url } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/apkmod/get', {
               url: url
            })
            if (!json.status) throw Func.jsonFormat(json)
            let txt = `乂  *A P K M O D*\n\n`
            txt += '   ◦  *Name* : ' + json.data.name + '\n'
            txt += '   ◦  *Size* : ' + json.data.size + '\n'
            txt += '   ◦  *Rating* : ' + json.data.rating + '\n'
            txt += '   ◦  *Version* : ' + json.data.version + '\n'
            txt += '   ◦  *Mod* : ' + json.data.mod + '\n\n'
            txt += global.footer
            const chSize = Func.sizeLimit(json.data.size, isPrem ? env.max_upload : env.max_upload_free)
            const isOver = isPrem ? `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.file.url))}` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
            if (chSize.oversize) throw isOver
            conn.sendLinkPreview(m.chat, txt, m, {
               ratio: 'potrait', // landscape (default), potrait, square */
               thumbnail: json.data.thumbnail,
            }).then(() => {
               conn.sendFile(m.chat, json.file.url, json.file.filename, '', m)
            })
         } else {
            if (!text) throw Func.example(usedPrefix, command, 'demi kau dan si buah hati')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/apkmod', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.apkmod[m.chat] = {
               list: json.data.result.map(v => ({ url: v.url })),
               timer: setTimeout(() => {
                  delete conn.apkmod[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *A P K M O D*\n\n`
            json.data.result.slice(0, 10).map((v, i) => {
               txt += `*${i + 1}.* ${v.name}\n`
               txt += `◦ *Size* : ${v.size}\n`
               txt += `◦ *Version* : ${v.version}\n`
               txt += `◦ *Mod* : ${v.mod}\n\n`
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