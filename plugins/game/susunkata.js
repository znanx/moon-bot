module.exports = [{
   help: ['susunkata'],
   aliases: ['suskaclue', 'suskaskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.susunkata = conn.susunkata ? conn.susunkata : {}
      let id = m.chat
      if (command == 'susunkata') {
         if (id in conn.susunkata) return conn.reply(m.chat, 'There are still unanswered questions.', conn.susunkata[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/susunkata.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}suskaclue* for help, and *${usedPrefix}suskaskip* to delete the game session.`
         conn.susunkata[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.susunkata[id]) conn.reply(m.chat, 'Time\'s up!', conn.susunkata[id][0])
               delete conn.susunkata[id]
            }, env.timer)
         ]
      } else if (command == 'suskaclue') {
         if (!(id in conn.susunkata)) return
         let clue = conn.susunkata[id][1].jawaban.replace(/[AIUEO]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'suskaskip') {
         if ((id in conn.susunkata)) return conn.reply(m.chat, '✅ The susunkata game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.susunkata[id][3])
            delete conn.susunkata[id]
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
         conn.susunkata = conn.susunkata ? conn.susunkata : {}
         if (m.quoted && /suskaclue/i.test(m.quoted.text)) {
            if (!(id in conn.susunkata) && /suskaskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.susunkata[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.susunkata[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.susunkata[id][3])
                     delete conn.susunkata[id]
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