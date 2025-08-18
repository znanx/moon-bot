const moment = require('moment-timezone')

module.exports = {
   help: ['npmjs'],
   use: 'query',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, '@moonr/to-anime'))
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/npm', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Package not found.'))
         let txt = `乂 *N P M J S*\n\n`
         json.data.map((v, i) => {
            txt += '*' + (i + 1) + '. ' + v.package.name + '*\n'
            txt += '  ◦  *Version* : ' + v.package.version + '\n'
            txt += '  ◦  *Description* : ' + v.package.description + '\n'
            txt += '  ◦  *Author* : @' + v.package.publisher.username + '\n'
            txt += '  ◦  *Published* : ' + moment(v.package.date).format('dddd, DD/MM/YYYY hh:mm') + '\n'
            txt += '  ◦  *Link* : ' + v.package.links.npm + '\n\n'
         })
         conn.reply(m.chat, txt + global.footer, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}