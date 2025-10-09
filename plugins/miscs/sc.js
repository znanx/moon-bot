const moment = require('moment-timezone')

module.exports = {
   help: ['sourcecode'],
   aliases: ['sc'],
   tags: 'miscs',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         const json = await Func.fetchJson('https://api.github.com/repos/rifnd/moon-bot')
         let txt = `乂  *S C R I P T*\n\n`
         txt += `   ∘  *Name* : ${json.name}\n`
         txt += `   ∘  *Size* : ${(json.size / 1024).toFixed(2)} MB\n`
         txt += `   ∘  *Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`
         txt += `   ∘  *Url* : ${json.html_url}\n`
         txt += `   ∘  *Forks* : ${json.forks_count}\n`
         txt += `   ∘  *Stars* : ${json.stargazers_count}\n`
         txt += `   ∘  *Issues* : ${json.open_issues_count}\n\n`
         txt += global.footer
         conn.sendMessageModify(m.chat, txt, m, {
            largeThumb: true,
            url: 'https://github.com/rifnd/moon-bot'
         })
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   error: false
}