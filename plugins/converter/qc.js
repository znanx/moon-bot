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
         if (!text) throw Func.example(usedPrefix, command, 'Hi!')
         let pic = await conn.profilePictureUrl(m.quoted ? m.quoted.sender : m.sender, 'image').catch(() => 'https://archio.qzz.io/1770100074980-default.jpg')
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
                  "name": m.quoted ? global.db.users[m.quoted.sender].name : m.pushName,
                  "photo": {
                     "url": pic
                  }
               },
               "text": text,
               "replyMessage": {}
            }]
         }
         const response = await axios.post('https://znanstore-quotly.hf.space/quote/generate', json, {
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
         throw Func.jsonFormat(e)
      }
   },
   limit: true
}