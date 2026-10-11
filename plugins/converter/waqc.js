module.exports = {
   help: ['waqc'],
   use: 'text / reply media',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'spacemoon')
         if (text.length > 300) throw Func.texted('bold', '🚩 Teks terlalu panjang! maksimal 300 karakter.')
         let old = new Date()
         conn.sendReact(m.chat, '🕒', m.key)

         let pic
         try {
            pic = await Promise.race([
               conn.profilePictureUrl(m.sender, 'image'),
               new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1200))
            ])
         } catch {
            pic = ''
         }

         let sender_img = ''
         if (/image/.test(m.mtype)) {
            const img = await m.download()
            const up = await Scraper.uploader(img)
            sender_img = up.data.url
         }

         let quoted_img = ''
         if (m.quoted && /image/.test(m.quoted.mtype)) {
            const img = await m.quoted.download()
            const up = await Scraper.uploader(img)
            quoted_img = up.data.url
         }

         const fmtNum = (jid = '') => {
            const d = jid.replace(/\D/g, '')
            return '+62 ' + d.replace(/^(62|0)/, '').replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
         }
         const pad = n => String(n).padStart(2, '0')

         const payload = {
            sender_name: m.pushName,
            sender_number: fmtNum(m.sender),
            sender_avatar: pic,
            // sender_color: '#53bdeb',
            sender_image: sender_img,
            message: text,
            time: `${pad(old.getHours())}.${pad(old.getMinutes())}`,
            theme: 'dark',
            background: true,
            scale: 4,
            format: 'png',
            quoted: {
               name: m.quoted ? conn.getNameV2(m.quoted.sender) : '',
               number: m.quoted ? fmtNum(m.quoted.sender) : '',
               message: m.quoted ? (m.quoted.text || m.quoted.caption || '') : '',
               image: quoted_img,
               // color: '#53bdeb'
            }
         }
         const json = await Api.post('/canvas/wabubble', { payload })
         if (!json.status) throw Func.jsonFormat(json)

         return conn.sendFile(m.chat, json.data.url, Func.filename('png'), `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: 3,
   error: false
}
