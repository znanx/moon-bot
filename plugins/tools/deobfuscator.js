module.exports = {
   help: ['deobfuscator'],
   use: 'code',
   tags: 'tools',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text && !(m.quoted?.text)) throw Func.example(usedPrefix, command, 'var+_0x5377%3D%5B"Hello+World%21"%5D%3Bvar+a%3D_0x5377%5B0%5D%3Bfunction+MsgBox%28_0x82a8x3%29%7Balert%28_0x82a8x3%29%3B%7D%3BMsgBox%28a%29%3B')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/deobfuscator', {
            code: text || m.quoted.text
         })
         if (!json.status) throw Func.jsonFormat(json)
         conn.reply(m.chat, Func.jsonFormat(json.data), m)
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   premium: true
}