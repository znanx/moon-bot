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
         if (!text) throw Func.example(usedPrefix, command, 'Surabaya')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/searching/jadwalsalat', {
            q: text
         })
         if (!json.status) throw Func.jsonFormat(json)
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
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}