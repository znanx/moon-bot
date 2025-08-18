module.exports = {
   help: ['jadwalshalat'],
   use: 'city',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Surabaya'), m)
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/jadwalsholat', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let txt = '乂  *S H A L A T*\n\n'
         txt += '   ◦  *Tanggal* : ' + json.data.tgl + '\n'
         txt += '   ◦  *Imsyak* : ' + json.data.imsyak + '\n'
         txt += '   ◦  *Subuh* : ' + json.data.subuh + '\n'
         txt += '   ◦  *Terbit* : ' + json.data.terbit + '\n'
         txt += '   ◦  *Dzuhur* : ' + json.data.dzuhur + '\n'
         txt += '   ◦  *Asar* : ' + json.data.ashr + '\n'
         txt += '   ◦  *Maghrib* : ' + json.data.maghrib + '\n'
         txt += '   ◦  *Isya* : ' + json.data.isya + '\n\n'
         txt += json.data.parameter
         conn.reply(m.chat, txt, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}