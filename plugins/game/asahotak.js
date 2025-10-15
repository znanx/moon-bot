module.exports = [{
   help: ['asahotak'],
   aliases: ['aoclue', 'aoskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.asahotak = conn.asahotak ? conn.asahotak : {}
      let id = m.chat
      if (command == 'asahotak') {
         if (id in conn.asahotak) return conn.reply(m.chat, 'There are still unanswered questions.', conn.asahotak[id][0])
         const json = await Func.jsonRandom('https://raw.githubusercontent.com/znanx/db/refs/heads/master/games/asahotak.json')
         let txt = `${json.soal}\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}aoclue* for help, and *${usedPrefix}aoskip* to delete the game session.`
         conn.asahotak[id] = [
            await conn.reply(id, txt, m),
            json,
            setTimeout(() => {
               if (conn.asahotak[id]) conn.reply(m.chat, 'Time\'s up!', conn.asahotak[id][0])
               delete conn.asahotak[id]
            }, env.timer)
         ]
      } else if (command == 'aoclue') {
         if (!(id in conn.asahotak)) return
         let clue = conn.asahotak[id][1].jawaban.replace(/[AIUEO]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'aoskip') {
         if ((id in conn.asahotak)) return conn.reply(m.chat, '✅ The asahotak game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.asahotak[id][3])
            delete conn.asahotak[id]
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
         conn.asahotak = conn.asahotak ? conn.asahotak : {}
         if (m.quoted && /aoclue/i.test(m.quoted.text)) {
            if (!(id in conn.asahotak) && /aoskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.asahotak[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.asahotak[id][1]))
               if (body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
                  conn.reply(m.chat, `✅ *+${Func.formatNumber(reward)}* Exp`, m).then(() => {
                     users.exp += reward
                     clearTimeout(conn.asahotak[id][3])
                     delete conn.asahotak[id]
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