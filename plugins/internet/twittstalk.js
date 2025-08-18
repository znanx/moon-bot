module.exports = {
   help: ['twitstalk'],
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
         if (!text) return conn.reply(usedPrefix, command, 'elonmusk')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/twitter-stalk', {
            username: text
         })
         if (!json.status) return conn.reply(m.chat, `🚩 ${json.msg}`, m)
         let tek = `乂  *T W I T S T A L K*\n\n`
         tek += `   ∘  *Username* : ${json.data.username}\n`
         tek += `   ∘  *Nickname* : ${json.data.nickname}\n`
         tek += `   ∘  *Location* : ${json.data.join_at}\n`
         tek += `   ∘  *Join At* : ${json.data.location}\n`
         tek += `   ∘  *Tweets* : ${json.data.tweets_count}\n`
         tek += `   ∘  *Followers* : ${json.data.followers}\n`
         tek += `   ∘  *Followed* : ${json.data.following}\n\n`
         tek += global.footer
         conn.sendFile(m.chat, json.data.profile, '', tek, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}