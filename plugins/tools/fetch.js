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
      if (!/^https?:\/\//.test(text)) throw Func.example(usedPrefix, command, 'https://google.com')

      const res = await fetch(text)
      const length = Number(res.headers.get('content-length') || 0)
      if (length > 100 * 1024 * 1024) throw `Content is too large: ${length} bytes`

      const type = res.headers.get('content-type') || ''

      if (!/text|json/.test(type)) return conn.sendFile(m.chat, text, '', text, m)
      let txt
      const raw = await res.text()

      try {
         txt = util.format(JSON.parse(raw))
      } catch {
         txt = raw
      }

      m.reply(txt.slice(0, 65536))
   },
   limit: true
}