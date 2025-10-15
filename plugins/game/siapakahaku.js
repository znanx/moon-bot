module.exports = [{
   help: ['siapakahaku'],
   aliases: ['whoclue', 'whoskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
      let id = m.chat
      if (command == 'siapakahaku') {
         if (id in conn.siapakahaku) return conn.reply(m.chat, 'There are still unanswered questions.', conn.siapakahaku[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/siapakahaku.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}whoclue* for help, and *${usedPrefix}whoskip* to delete the game session.`
         conn.siapakahaku[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.siapakahaku[id]) conn.reply(m.chat, 'Time\'s up!', conn.siapakahaku[id][0])
               delete conn.siapakahaku[id]
            }, env.timer)
         ]
      } else if (command == 'whoclue') {
         if (!(id in conn.siapakahaku)) return
         let clue = conn.siapakahaku[id][1].jawaban.replace(/[aiueo]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'whoskip') {
         if ((id in conn.siapakahaku)) return conn.reply(m.chat, '✅ The siapakahaku game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.siapakahaku[id][3])
            delete conn.siapakahaku[id]
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
         conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
         if (m.quoted && /whoclue/i.test(m.quoted.text)) {
            if (!(id in conn.siapakahaku) && /whoskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.siapakahaku[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.siapakahaku[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.siapakahaku[id][3])
                     delete conn.siapakahaku[id]
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