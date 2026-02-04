module.exports = {
   help: ['cuaca'],
   use: 'area',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!conn.cuaca) conn.cuaca = {}
         if (/^\d+$/.test(text)) {
            if (typeof conn.cuaca?.[m.chat] === 'undefined') throw `🚩 The data has expired. Please search again with *${usedPrefix + command}*.`
            let idx = parseInt(text) - 1
            let data = conn.cuaca[m.chat].list
            if (isNaN(idx) || !data[idx]) throw '🚩 Invalid Number!'
            let { lon, lat } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/weather/get', {
               longitude: lon,
               latitude: lat
            })
            let txt = `乂  *W E A T H E R*\n\n`
            txt += `   ◦  *Weather* : ${json.data.cuaca.weather_desc} - ${json.data.cuaca.weather_desc_en}\n`
            txt += `   ◦  *Province* : ${json.data.lokasi.provinsi}\n`
            txt += `   ◦  *Region* : Ds. ${json.data.lokasi.desa} - Kec. ${json.data.lokasi.kecamatan} - City/District. ${json.data.lokasi.kotkab}\n`
            txt += `   ◦  *Longitude* : ${json.data.lokasi.lon}\n`
            txt += `   ◦  *Latitude* : ${json.data.lokasi.lat}\n`
            txt += `   ◦  *Time* : ${json.data.cuaca.local_datetime}\n\n`
            txt += global.footer
            return conn.reply(m.chat, txt, m)
         } else {
            if (!text) throw Func.example(usedPrefix, command, 'Porong')
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/searching/weather', {
               q: text
            })
            if (!json.status) throw Func.jsonFormat(json)
            conn.cuaca[m.chat] = {
               list: json.data,
               timer: setTimeout(() => {
                  delete conn.cuaca[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let txt = `乂  *W E A T H E R*\n\n`
            json.data.slice(0, 10).map((v, i) => {
               txt += `*${i + 1}.* ${v.kotkab} - ${v.provinsi}\n`
               txt += `   ◦ Kec. ${v.kecamatan} - Ds. ${v.desa}\n\n`
            })
            txt += `Type a number ( 1 - 10 ) to see details.`
            conn.reply(m.chat, txt, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}
