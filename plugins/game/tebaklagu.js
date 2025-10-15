module.exports = [{
   help: ['tebaklagu'],
   aliases: ['songclue', 'songskip'],
   tags: 'game',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      env,
      Func
   }) => {
      conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
      let id = m.chat
      if (command == 'tebaklagu') {
         if (id in conn.tebaklagu) return conn.reply(m.chat, 'There are still unanswered questions.', conn.tebaklagu[id][0])
         let json = await Api.get('/tebaklagu')
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let audio = await conn.sendFile(m.chat, json.data.lagu, 'audio.mp3', '', m)
         let txt = `What is the title of this song excerpt?\n\n`
         txt += `Timeout : [ *${env.timer / 1000 / 60} menit* ]\n`
         txt += `Reply to this message to respond, send *${usedPrefix}songclue* for help, and *${usedPrefix}songskip* to delete the game session.`
         conn.tebaklagu[id] = [
            await conn.reply(m.chat, txt, audio),
            json,
            setTimeout(() => {
               if (conn.tebaklagu[id]) conn.reply(m.chat, 'Time\'s up!', conn.tebaklagu[id][0])
               delete conn.tebaklagu[id]
            }, env.timer)
         ]
      } else if (command == 'songclue') {
         if (!(id in conn.tebaklagu)) return
         let clue = conn.tebaklagu[id][1].data.judul.replace(/[aiueo]/g, '_')
         conn.reply(m.chat, `Clue : *${clue}*`, m)
      } else if (command == 'songskip') {
         if ((id in conn.tebaklagu)) return conn.reply(m.chat, '✅ The tebaklagu game session has been successfully deleted.', m).then(() => {
            clearTimeout(conn.tebaklagu[id][3])
            delete conn.tebaklagu[id]
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
         conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
         if (m.quoted && /songclue/i.test(m.quoted.text)) {
            if (!(id in conn.tebaklagu) && /songskip/i.test(m.quoted.text)) return conn.reply(m.chat, 'The question has ended.', m)
            if (m.quoted.id == conn.tebaklagu[id][0].key.id) {
               if (['Timeout', ''].includes(body)) return !0
               let json = JSON.parse(JSON.stringify(conn.tebaklagu[id][1]))
               if (body.toLowerCase() == json.data.judul.toLowerCase().trim()) {
                  await m.reply(`✅ *+${Func.formatNumber(reward)}* Exp`).then(() => {
                     users.exp += reward
                     clearTimeout(conn.tebaklagu[id][3])
                     delete conn.tebaklagu[id]
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