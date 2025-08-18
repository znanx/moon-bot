module.exports = {
   help: ['checkapi'],
   aliases: ['apikey'],
   tags: 'miscs',
   run: async (m, {
      conn,
      Func
   }) => {
      try {
         const json = await Api.get('/checkapi')
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
         let txt = '乂  *A P I K E Y*\n\n'
         txt += `   ◦  *Limit* : (${json.data.limit} / ${json.data.total})\n`
         txt += `   ◦  *Premium* : ${json.data.premium ? '√' : '×'}\n`
         txt += `   ◦  *Expired* : ${new Date(json.data.expired_at).toLocaleDateString('id-ID')}\n`
         txt += `   ◦  *Joinded* : ${new Date(json.data.joined_at).toLocaleDateString('id-ID')}\n\n`
         txt += global.footer
         conn.reply(m.chat, txt, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false
}