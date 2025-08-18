const axios = require('axios')
module.exports = {
   help: ['qc'],
   use: 'text',
   tags: 'converter',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      setting,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Hi!'), m)
         var pic = await conn.profilePictureUrl(m.quoted ? m.quoted.sender : m.sender, 'image') || 'https://i.ibb.co/NLJdrcJ/image.jpg'
         conn.sendReact(m.chat, '🕒', m.key)
         const json = {
            "type": "quote",
            "format": "png",
            "backgroundColor": "#0C0C0C",
            "width": 512,
            "height": 768,
            "scale": 2,
            "messages": [{
               "entities": [],
               "avatar": true,
               "from": {
                  "id": 1,
                  "name": m.quoted ? m.quoted.name : m.name,
                  "photo": {
                     "url": pic
                  }
               },
               "text": text,
               "replyMessage": {}
            }]
         }
         const response = await axios.post('https://bot.lyo.su/quote/generate', json, {
            headers: {
               'Content-Type': 'application/json'
            }
         })
         const buffer = Buffer.from(response.data.result.image, 'base64')
         conn.sendSticker(m.chat, buffer, m, {
            packname: setting.sk_pack,
            author: setting.sk_author
         })
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   error: false
}