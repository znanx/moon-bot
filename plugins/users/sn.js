const { createHash } = require('crypto')

module.exports = {
   help: ['sn'],
   tags: 'user',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      conn.reply(m.chat, createHash('md5').update(m.sender).digest('hex'), m)
   },
   private: true,
   register: true
}