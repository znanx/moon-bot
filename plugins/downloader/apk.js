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
      env,
      Func,
      Scraper
   }) => {
      try {
         conn.apk = conn.apk ? conn.apk : {}

         if (/^\d+$/.test(text)) {
            if (typeof conn.apk?.[m.chat] === 'undefined') throw `🚩 The data has expired, please search again with *${usedPrefix + command}*.`

            let idx = parseInt(text) - 1
            let data = conn.apk[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'

            const apk = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)

            let txt = `乂  *A P K*\n\n`
            txt += `   ◦  *Name* : ${apk.name}\n`
            txt += `   ◦  *Package* : ${apk.package}\n`
            txt += `   ◦  *Size* : ${Func.formatSize ? Func.formatSize(apk.size) : apk.size}\n`
            txt += `   ◦  *Version* : ${apk.file?.vername || 'N/A'}\n`
            txt += `   ◦  *Update* : ${apk.updated || apk.modified || 'N/A'}\n`
            txt += `   ◦  *Requirement* : ${apk.file?.sdk?.min || apk.requirement || 'N/A'}\n`
            txt += `   ◦  *Developer* : ${apk.developer?.name || 'N/A'}\n\n`
            txt += global.footer

            const fileSize = Func.formatSize(apk.size || apk.file?.filesize || 0)
            const chSize = Func.sizeLimit(fileSize, isPrem ? env.max_upload : env.max_upload_free)
            const isOver = isPrem
               ? `💀 File size (${fileSize}) exceeds the maximum limit, download it by yourself via this link : ${await Scraper.shorten(apk.path)}`
               : `⚠️ File size (${fileSize}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`

            if (chSize.oversize) throw isOver

            conn.sendMessageModify(m.chat, txt, m, {
               largeThumb: true,
               thumbnail: apk.icon
            }).then(async () => {
               await conn.sendFile(m.chat, apk.path, `${apk.uname || apk.package}.apk`, '', m)
            })

         } else {
            if (!text) throw Func.example(usedPrefix, command, 'whatever')
            conn.sendReact(m.chat, '🕒', m.key)

            const json = await Api.get('/searching/playstore', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)

            const list = json.data?.datalist?.list || []
            if (!list.length) throw `🚩 No results found for "${text}"`

            conn.apk[m.chat] = {
               list: list.map(v => ({
                  name: v.name,
                  package: v.package,
                  uname: v.uname,
                  size: v.size,
                  icon: v.icon,
                  path: v.path,
                  updated: v.updated || v.modified,
                  developer: v.developer,
                  file: v.file
               })),
               timer: setTimeout(() => {
                  delete conn.apk[m.chat]
               }, 2 * 60 * 1000)
            }

            let txt = `乂  *A P K*\n\n`
            list.slice(0, 10).forEach((v, i) => {
               txt += `*${i + 1}.* ${v.name}\n`
               txt += `◦ *Package* : ${v.package}\n`
               txt += `◦ *Size* : ${Func.formatSize ? Func.formatSize(v.size) : v.size}\n`
               txt += `◦ *Developer* : ${v.developer?.name || 'N/A'}\n\n`
            })
            txt += `Type a number ( 1 - 10 ) to download.`
            conn.reply(m.chat, txt, m)
         }

      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}