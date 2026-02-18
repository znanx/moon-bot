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
         return conn.sendFile(m.chat, result.downloadUrl, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true,
   error: false
}