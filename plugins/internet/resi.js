module.exports = {
   help: ['cekresi'],
   use: 'kurir | resi',
   tags: 'internet',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'jnt | 842748402')
         conn.sendReact(m.chat, '🕒', m.key)
         let [kurir, resi] = text.split` | `
         const json = await Api.get('/resicheck', {
            kurir, resi
         })
         if (!json.status) throw `🚩 ${json.msg}`
         let p = '◦  *Code* : ' + json.data.detail.code + '\n'
         p += '◦  *Status* : ' + json.data.detail.status + '\n'
         p += '◦  *Shipment* : ' + json.data.detail.shipment ? json.data.detail.shipment : '-' + '\n'
         p += '◦  *Received* : ' + json.data.detail.received ? json.data.detail.received : '-' + '\n\n'
         p += '*History Detail*' + '\n\n'
         json.data.detail.history.map((v, i) => {
            p += '◦  *Time* : ' + v.time + '\n'
            p += '◦  *Position* : ' + v.position + '\n'
            p += '◦  *Desc* : ' + v.desc + '\n\n'
         })
         conn.reply(m.chat, p, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}