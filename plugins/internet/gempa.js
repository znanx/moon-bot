module.exports = {
   help: ['gempa'],
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
         const json = await Api.get('/gempa', {})
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         conn.sendReact(m.chat, '🕒', m.key)
         let txt = `乂  *G E M P A*\n\n`
         txt += `   ◦  *Date* : ${json.data.Tanggal}\n`
         txt += `   ◦  *At* : ${json.data.Jam}\n`
         txt += `   ◦  *Magnitude* : ${json.data.Magnitude}\n`
         txt += `   ◦  *Coordinate* : ${json.data.Coordinates}\n`
         txt += `   ◦  *Latitude* : ${json.data.Lintang}\n`
         txt += `   ◦  *Longitude* : ${json.data.Bujur}\n`
         txt += `   ◦  *Depth* : ${json.data.Kedalaman}\n`
         txt += `   ◦  *Region* : ${json.data.Wilayah}\n`
         txt += `   ◦  *Potential* : ${json.data.Potensi}\n`
         txt += `   ◦  *Sensed* : ${json.data.Dirasakan}\n\n`
         txt += global.footer
         conn.sendFile(m.chat, json.data.Shakemap, '', txt, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}