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
         if (!text) throw Func.example(usedPrefix, command, 'chalk')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/searching/npmjs', {
            q: text
         })
         if (!json.status) throw Func.jsonFormat(json)
         if (json.data.length == 0) throw Func.texted('bold', '🚩 Package not found.')
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
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}