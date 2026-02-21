module.exports = {
   help: ['rednote'],
   use: 'link',
   tags: 'downloader',
   run: async (m, {
      conn,
      args,
      usedPrefix,
      command,
      Func
   }) => {
      try {
         if (!args || !args[0]) throw Func.example(usedPrefix, command, 'https://www.xiaohongshu.com/discovery/item/699814c30000000015020717?source=webshare&xhsshare=pc_web&xsec_token=AB_fp-44qzFasNl9SXGS4v0lB5xXzKW3wU8vYWsRc69Tw=&xsec_source=pc_share')
         if (!/(xhslink\.com|xiaohongshu\.com)/.test(args[0])) throw global.status.invalid
         conn.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.get('/downloader/rednote', {
            url: args[0]
         })
         if (!json.status) throw Func.jsonFormat(json)
         json.data.result.map(async (v, i) => {
            conn.sendFile(m.chat, v.url, v.type === 'image' ? Func.filename('jpg') : '', `🍟 *Process* : ${(new Date() - old) * 1} ms`, m)
            await Func.delay(1500)
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}