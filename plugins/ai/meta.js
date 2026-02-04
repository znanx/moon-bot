module.exports = {
   help: ['meta'],
   use: 'prompt / query',
   tags: 'ai',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) throw Func.example(usedPrefix, command, 'mark itu orang atau alien')
         conn.sendReact(m.chat, '🕒', m.key)
         const json = await Api.get('/ai/meta', {
            prompt: text
         })
         var media = []
         if (!json.status) throw Func.jsonFormat(json)
         if (json.data.imagine_media.length != 0) {
            json.data.imagine_media.map(async v => {
               media.push({
                  url: v.uri
               })
            })
            conn.sendAlbumMessage(m.chat, media, m)
         } else {
            conn.reply(m.chat, json.data.content, m)
         }
      } catch (e) {
         throw Func.jsonFormat(e)
      }
   },
   limit: true,
   error: false
}