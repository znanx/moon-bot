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
            if (typeof conn.cuaca?.[m.chat] === 'undefined') return conn.reply(m.chat, `🚩 The data has expired. Please search again with *${usedPrefix + command}*.`, m)
            let idx = parseInt(text) - 1
            let data = conn.cuaca[m.chat].list
            if (isNaN(idx) || !data[idx]) return conn.reply(m.chat, '🚩 Invalid Number!', m)
            let { lon, lat } = data[idx]
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/cuaca-get', {
               longitude: lon,
               latitude: lat
            })
            let teks = `乂  *W E A T H E R*\n\n`
            teks += `   ◦  *Weather* : ${json.data.cuaca.weather_desc} - ${json.data.cuaca.weather_desc_en}\n`
            teks += `   ◦  *Province* : ${json.data.lokasi.provinsi}\n`
            teks += `   ◦  *Region* : Ds. ${json.data.lokasi.desa} - Kec. ${json.data.lokasi.kecamatan} - City/District. ${json.data.lokasi.kotkab}\n`
            teks += `   ◦  *Longitude* : ${json.data.lokasi.lon}\n`
            teks += `   ◦  *Latitude* : ${json.data.lokasi.lat}\n`
            teks += `   ◦  *Time* : ${json.data.cuaca.local_datetime}\n\n`
            teks += global.footer
            return conn.reply(m.chat, teks, m)
         } else {
            if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Porong'), m)
            conn.sendReact(m.chat, '🕒', m.key)
            const json = await Api.get('/cuaca', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.cuaca[m.chat] = {
               list: json.data,
               timer: setTimeout(() => {
                  delete conn.cuaca[m.chat]
               }, 2 * 60 * 1000) // 2 minutes
            }
            let teks = `乂  *W E A T H E R*\n\n`
            json.data.slice(0, 10).map((v, i) => {
               teks += `*${i + 1}.* ${v.kotkab} - ${v.provinsi}\n`
               teks += `   ◦ Kec. ${v.kecamatan} - Ds. ${v.desa}\n\n`
            })
            teks += `Type a number ( 1 - 10 ) to see details.`
            conn.reply(m.chat, teks, m)
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}
