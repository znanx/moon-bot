module.exports = {
   help: ['obfuscator'],
   use: 'code',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text && !(m.quoted?.text)) return conn.reply(m.chat, Func.example(usedPrefix, command, async function isUrl(url) {
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.#?&/=]*)/, 'gi'))
         }), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let json = await Api.get('/obfuscator', {
            code: text || m.quoted.text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.reply(m.chat, json.data, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}