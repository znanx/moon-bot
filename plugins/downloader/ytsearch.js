const ytsearch = require('yt-search')

const ytsO = {
   help: ['ytsearch'],
   aliases: ['yts', 'youtubesearch'],
   use: 'query',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'Oasis')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = (await ytsearch(text)).all.filter(p => p.type === 'video')
         let txt = '乂  *Y T - S E A R C H*\n\n'
         json.map((v, i) => {
            txt += `*${i + 1}*. ${v.title}\n`
            txt += `◦  *Channel* : ${v.author.name}\n`
            txt += `◦  *Duration* : ${v.timestamp}\n`
            txt += `◦  *Views* : ${Func.h2k(v.views)}\n`
            txt += `◦  *Upload* : ${v.ago}\n`
            txt += `◦  *Link* : ${v.url}\n\n`
         }).join('\n\n')
         txt += global.footer
         conn.reply(m.chat, txt, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}

module.exports = ytsO