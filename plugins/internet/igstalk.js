module.exports = {
   help: ['igstalk'],
   use: 'username',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'bulansutena'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/igstalk', {
            username: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let txt = `乂  *I G S T A L K*\n\n`
         txt += `   ◦  *Username* : ` + json.data.username + '\n'
         txt += `   ◦  *Name* : ` + json.data.fullname + '\n'
         txt += `   ◦  *Followers* : ` + Func.formatNumber(json.data.followers) + '\n'
         txt += `   ◦  *Followed* : ` + Func.formatNumber(json.data.following) + '\n'
         txt += `   ◦  *Posts* : ` + Func.formatNumber(json.data.post) + '\n'
         txt += `   ◦  *Url* : https://instagram.com/` + json.data.username + '\n'
         txt += `   ◦  *Bio* : ` + json.data.bio || '-'
         txt += `\n\n` + global.footer
         conn.sendFile(m.chat, json.data.profile, Func.filename('jpg'), txt, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}