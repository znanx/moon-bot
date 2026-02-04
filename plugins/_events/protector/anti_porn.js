module.exports = {
   run: async (m, {
      conn,
      groupSet,
      Scraper,
      Func
   }) => {
      try {
         if (!m.fromMe && groupSet.antiporn && /image/.test(m.mtype) && !isAdmin) {
            const cdn = await Scraper.uploader(await m.download())
            if (!cdn.status) throw new Error(cdn)
            const json = await Api.get('/tools/detect-porn', {
               input: cdn.data.url
            })
            if (!json.status) throw new Error(json)
            if (json.data.isPorn) return conn.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.key.id,
                  participant: m.sender
               }
            }).then(() => {
               conn.reply(m.chat, Func.texted('bold', `🚩 Detected @${m.sender.split('@')[0]} sending porn`), m)
               conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            })
         }
      } catch (e) {
         console.log(e)
      }
   },
   group: true,
   botAdmin: true,
   error: false
}