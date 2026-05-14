const os = require('os')
module.exports = {
   help: ['server'],
   tags: 'miscs',
   run: async (m, {
      conn,
      setting,
      Func
   }) => {
      try {
         const json = await Func.fetchJson('http://ip-api.com/json')
         delete json.status
         delete json.query
         let txt = `乂  *S E R V E R*\n\n`
         txt += `┌  ◦  OS : ${os.type()} (${os.arch()} / ${os.release()})\n`
         txt += `│  ◦  Ram : ${Func.formatSize(process.memoryUsage().rss)} / ${Func.formatSize(os.totalmem())}\n`
         for (let key in json) txt += `│  ◦  ${Func.ucword(key)} : ${json[key]}\n`
         txt += `│  ◦  Uptime : ${Func.toTime(os.uptime * 1000)}\n`
         txt += `└  ◦  Processor : ${os.cpus()[0].model}\n\n`
         txt += global.footer
         conn.sendLinkPreview(m.chat, txt, m, {
            ratio: 'potrait', // landscape (default), potrait, square */
            thumbnail: setting.cover,
         })
      } catch (e) {
         console.log(e)
      }
   }
}