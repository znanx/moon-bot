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
         const json = await Api.get('/searching/gempa')
         if (!json.status) throw Func.jsonFormat(json)
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
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}