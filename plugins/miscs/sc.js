const moment = require('moment-timezone')
moment.tz.setDefault(process.env.TZ)
module.exports = {
   help: ['sourcecode'],
   aliases: ['sc'],
   tags: 'miscs',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         let json = await Func.fetchJson('https://api.github.com/repos/rifnd/moon-bot')
         let capt = `乂  *S C R I P T*\n\n`
         capt += `   ∘  *Name* : ${json.name}\n`
         capt += `   ∘  *Size* : ${(json.size / 1024).toFixed(2)} MB\n`
         capt += `   ∘  *Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`
         capt += `   ∘  *Url* : ${json.html_url}\n`
         capt += `   ∘  *Forks* : ${json.forks_count}\n`
         capt += `   ∘  *Stars* : ${json.stargazers_count}\n`
         capt += `   ∘  *Issues* : ${json.open_issues_count}\n\n`
         capt += global.footer
         conn.sendMessageModify(m.chat, capt, m, {
            largeThumb: true,
            url: 'https://github.com/rifnd/moon-bot'
         })
      } catch (e) {
         console.log(e)
      }
   }
}