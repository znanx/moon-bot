const fs = require('fs')

module.exports = {
   help: ['button1', 'button2', 'button3', 'button4', 'button5', 'button6'],
   tags: 'example',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      setting,
      Func 
   }) => {
      try {
         switch (command) {
            case 'button1':
               const buttons = [{
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'Runtime',
                     id: `${usedPrefix}run`
                  })
               }, {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'Tap Here!',
                     sections: [{
                        rows: [{
                           title: 'Dummy 1',
                           // description: `X`,
                           id: `${usedPrefix}run`
                        }, {
                           title: 'Dummy 2',
                           // description: `Y`,
                           id: `${usedPrefix}run`
                        }]
                     }]
                  })
               }]
               conn.sendIAMessage(m.chat, buttons, m, {
                  header: global.header,
                  content: 'Hi! @0',
                  v2: true,
                  footer: global.footer,
                  media: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
               })
            break

            case 'button2': // Button 2 (Text Only)
               conn.sendButton(m.chat, [{
                  text: 'Runtime',
                  command: '.runtime'
               }, {
                  text: 'Statistic',
                  command: '.stat'
               }], m, {
                  text: 'Hi @0',
                  footer: global.footer
               })
            break

            case 'button3': // Button 3 (Image & Video)
               conn.sendButton(m.chat, [{
                  text: 'Runtime',
                  command: '.runtime'
               }, {
                  text: 'Statistic',
                  command: '.stat'
               }], m, {
                  text: 'Hi @0',
                  footer: global.footer,
                  media: fs.readFileSync('./src/image/default.jpg') // video or image (url or buffer)
               })
            break

            case 'button4': // Button 4 (Document)
               conn.sendButton(m.chat, [{
                  text: 'Runtime',
                  command: '.runtime'
               }, {
                  text: 'Statistic',
                  command: '.stat'
               }], m, {
                  text: 'Hi @0',
                  footer: global.footer,
                  media: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'), // video or image link
                  document: {
                     filename: 'moon-bot.jpg'
                  }
               })
            break

            case 'button5': // Button 5 (Carousel)
               const cards = [{
                  header: {
                     imageMessage: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                     hasMediaAttachment: true,
                  },
                  body: {
                     text: "P"
                  },
                  nativeFlowMessage: {
                     buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                           display_text: 'Community',
                           url: global.db.setting.link,
                           webview_presentation: null
                        })
                     }]
                  }
               }, {
                  header: {
                     imageMessage: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                     hasMediaAttachment: true,
                  },
                  body: {
                     text: "P"
                  },
                  nativeFlowMessage: {
                     buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                           display_text: 'Alyachan API',
                           url: 'https://api.alyachan.dev',
                           webview_presentation: null
                        })
                     }]
                  }
               }]

               conn.sendCarousel(m.chat, cards, m, {
                  content: 'Hi!'
               })
            break

            case 'button6': // Button 6 (Message Modify)
               conn.sendButton(m.chat, [{
                  text: 'Runtime',
                  command: '.runtime'
               }, {
                  text: 'Statistic',
                  command: '.stat'
               }], m, {
                  text: 'Hi @0',
                  footer: global.footer,
                  docs: {
                     name: 'オートメーション',
                     pages: 20,
                     size: '1GB',
                     extension: 'ppt'
                  },
                  body: 'WhatsApp Automation',
                  thumbnail: Func.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
               })
            break
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false
}