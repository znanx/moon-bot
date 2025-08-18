module.exports = {
   run: async (m, {
      conn,
      groupSet,
      isBotAdmin,
      body,
      Func
   }) => {
      try {
         if (!m.fromMe && body && (groupSet.antivirtex && body.match(/(৭৭৭৭৭৭৭৭|๒๒๒๒๒๒๒๒|๑๑๑๑๑๑๑๑|ดุท้่เึางืผิดุท้่เึางื)/gi) || groupSet.antivirtex && body.length > 10000)) return conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: false,
               id: m.key.id,
               participant: m.sender
            }
         }).then(() => conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   botAdmin: true,
   error: false
}