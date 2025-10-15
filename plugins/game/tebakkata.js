module.exports = [{
   help: ['tebakkata'],
   aliases: ['wordclue', 'wordskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
      let id = m.chat
      if (command == 'tebakkata') {
         if (id in conn.tebakkata) return conn.reply(m.chat, 'There are still unanswered questions.', conn.tebakkata[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/tebakkata.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}wordclue* for help, and *${usedPrefix}wordskip* to delete the game session.`
         conn.tebakkata[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.tebakkata[id]) conn.reply(m.chat, 'Time\'s up!', conn.tebakkata[id][0])
               delete conn.tebakkata[id]
            }, env.timer)
         ]
      } else if (command == 'wordclue') {
         if (!(id in conn.tebakkata)) return
         let clue = conn.tebakkata[id][1].jawaban.replace(/[AIUEO]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'wordskip') {
         if ((id in conn.tebakkata)) return conn.reply(m.chat, '✅ The tebakkata game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.tebakkata[id][3])
            delete conn.tebakkata[id]
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
         conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
         if (m.quoted && /wordclue/i.test(m.quoted.text)) {
            if (!(id in conn.tebakkata) && /wordclue/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.tebakkata[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.tebakkata[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.tebakkata[id][3])
                     delete conn.tebakkata[id]
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