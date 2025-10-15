module.exports = [{
   help: ['tekateki'],
   aliases: ['ridclue', 'ridskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.tekateki = conn.tekateki ? conn.tekateki : {}
      let id = m.chat
      if (command == 'tekateki') {
         if (id in conn.tekateki) return conn.reply(m.chat, 'There are still unanswered questions.', conn.tekateki[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/tekateki.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}ridclue* for help, and *${usedPrefix}ridskip* to delete the game session.`
         conn.tekateki[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.tekateki[id]) conn.reply(m.chat, 'Time\'s up!', conn.tekateki[id][0])
               delete conn.tekateki[id]
            }, env.timer)
         ]
      } else if (command == 'ridclue') {
         if (!(id in conn.tekateki)) return
         let clue = conn.tekateki[id][1].jawaban.replace(/[aiueo]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'ridskip') {
         if ((id in conn.tekateki)) return conn.reply(m.chat, '✅ The tekateki game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.tekateki[id][3])
            delete conn.tekateki[id]
         })
      }
   },
   limit: true,
   game: true,
   group: true,
   register: true
}, {
   run: async (m, {
      conn,
      prefixes,
      body,
      users,
      env,
      Func
   }) => {
      try {
         let id = m.chat
         let reward = Func.randomInt(env.min_reward, env.max_reward)
         conn.tekateki = conn.tekateki ? conn.tekateki : {}
         if (m.quoted && /ridclue/i.test(m.quoted.text)) {
            if (!(id in conn.tekateki) && /ridskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.tekateki[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.tekateki[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.tekateki[id][3])
                     delete conn.tekateki[id]
                  })
               } else conn.reply(m.chat, '❌ Wrong!', m)
            }
         }
      } catch (e) {
         throw new Error(e)
      }
   },
   game: true,
   group: true
}]