module.exports = {
   help: ['asupan'],
   use: 'username (optional)',
   tags: 'downloader',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/searching/tiktok/post', {
            q: args[0] || Func.random(['_hanna4yours', 'moodaaii', 'imnotnoncakeithh', 'athaw041', 'jacquelinesndr', 'joanne_flute', 'auwa___', 'aikolovesushi', 'liayuhuuu_', 'mrchellacty', 'michellechristoo', 'nauraurelia0', 'kharisma_ptw', 'avcdchs_'])
         })
         if (!json.status) throw `🚩 ${json.msg}`
         const result = await Func.random(json.data)
         let capt = '乂  *A S U P A N*\n\n'
         capt += `   ◦  *Views* : ${Func.formatNumber(result.stats.views)}\n`
         capt += `   ◦  *Likes* : ${Func.formatNumber(result.stats.likes)}\n`
         capt += `   ◦  *Comments* : ${Func.formatNumber(result.stats.comment)}\n`
         capt += `   ◦  *Shares* : ${Func.formatNumber(result.stats.share)}\n`
         capt += `   ◦  *Duration* : ${result.duration}\n`
         capt += `   ◦  *Quality* : ${result.quality}\n`
         capt += `   ◦  *Uploaded* : ${result.taken_at}\n`
         capt += `   ◦  *Size* : ${result.size}\n`
         capt += `   ◦  *Process* : ${((new Date - old) * 1)} ms\n\n`
         capt += '乂  *A U T H O R*\n\n'
         capt += `   ◦  *Author* : ${result.author.nickname} (@${result.author.fullname})\n`
         capt += `   ◦  *Verified* : ${result.author.verified ? 'Yes' : 'No'}\n`
         capt += `   ◦  *Followers* : ${Func.formatNumber(result.author.followers)}\n`
         capt += `   ◦  *Bio* : ${result.author.signature}\n\n`
         capt += '乂  *M U S I C - I N F O*\n\n'
         capt += `   ◦  ${result.music_info.title} - ${result.music_info.author}\n\n`
         capt += global.footer
         conn.sendFile(m.chat, result.data[0].url, '', capt, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true,
   error: false
}