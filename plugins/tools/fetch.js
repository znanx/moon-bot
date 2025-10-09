const util = require('util')

module.exports = {
   help: ['fetch'],
   aliases: ['get'],
   use: 'url',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      if (!/^https?:\/\//.test(text)) return conn.reply(m.chat, Func.example(usedPrefix, command, 'https://google.com'), m)
      let url = text
      let res = await fetch(url)
      if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
         delete res
         return m.reply(`Content-Length: ${res.headers.get('content-length')}`)
      }
      if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, '', text, m)
      let txt = await res.buffer()
      try {
         txt = util.format(JSON.parse(txt + ''))
      } catch (e) {
         txt = txt + ''
      } finally {
         m.reply(txt.slice(0, 65536) + '')
      }
   },
   limit: true
}