const { Function: Func } = new (require('@znan/wabot'))
const crypto = require('node:crypto')
const { generateWAMessageFromContent, generateWAMessage } = require('@whiskeysockets/baileys')

module.exports = conn => {
   /**
    * 
    * @param {*} jid 
    * @param {*} text 
    * @param {*} caption 
    * @param {*} opts 
    * @returns 
    */
   conn.fakeStory = async (jid, text, caption, opts = {}) => {
      let location = {
         key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            ...(jid ? {
               remoteJid: 'status@broadcast'
            } : {})
         },
         message: {
            "imageMessage": {
               "mimetype": "image/jpeg",
               "caption": caption,
               "jpegThumbnail": fs.readFileSync(`./src/image/thumbnail.jpg`)
            }
         }
      }
      return await conn.sendMessage(jid, {
         text,
         mentions: Func.mention(text)
      }, {
         userJid: conn.user.jid,
         quoted: location,
      })
   }
   /**
    * 
    * @param {*} jid 
    * @param {*} text 
    * @param {*} fakeJid 
    * @param {*} fakeText 
    * @param {*} fakeGroupJid 
    * @param {*} options 
    * @returns 
    */
   conn.fakeReply = async (jid, text = '', fakeJid = conn.user.jid, fakeText = '', fakeGroupJid, options) => {
      return conn.reply(jid, text, {
         key: {
            fromMe: areJidsSameUser(fakeJid, conn.user.id),
            participant: fakeJid,
            ...(fakeGroupJid ? {
               remoteJid: fakeGroupJid
            } : {})
         },
         message: {
            conversation: fakeText
         },
         ...options
      })
   }
   /**
    * 
    * @param {*} status 
    * @returns 
    */
   conn.setBio = async (status) => {
      return await conn.query({
         tag: "iq",
         attrs: {
            to: "s.whatsapp.net",
            type: "set",
            xmlns: "status",
         },
         content: [{
            tag: "status",
            attrs: {},
            content: Buffer.from(status, "utf-8"),
         }]
      })
   }
   /**
    * 
    * @param {*} jid 
    * @param {*} text 
    * @param {*} quoted 
    * @param {*} opts 
    * @returns 
    */
   conn.sendFDoc = async (jid, text, quoted, opts = {}) => {
      await conn.sendPresenceUpdate('composing', jid)
      return conn.sendMessage(jid, {
         contextInfo: {
            mentionedJid: Func.mention(text),
            ...opts
         },
         document: {
            url: 'https://qu.ax/vowNG.jpg'
         },
         url: 'https://mmg.whatsapp.net/v/t62.7119-24/31158881_1025772512163769_7208897168054919032_n.enc?ccb=11-4&oh=01_AdSBWokZF7M6H3NCfmTx08kHU3Dqw8rhlYlgUfXP6sACIg&oe=64CC069E&mms3=true',
         mimetype: (opts && opts.mime) ? mime(opts.mime) : mime(Func.random(['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf', 'text/rtf'])),
         fileSha256: 'dxsumNsT8faD6vN91lNkqSl60yZ5MBlH9L6mjD5iUkQ=',
         pageCount: (opts && opts.pages) ? Number(opts.pages) : 25,
         fileEncSha256: 'QGPsr3DQgnOdGpfcxDLFkzV2kXAaQmgTV8mYDzwrev4=',
         jpegThumbnail: (opts && opts.thumbnail) ? await Func.createThumb(opts.thumbnail) : '',
         fileName: (opts && opts.fname) ? opts.fname : global.header,
         fileLength: (opts && opts.fsize) ? Number(opts.fsize) : 1000000000000,
         caption: text,
         mediaKey: 'u4PCBMBCnVT0s1M8yl8/AZYmeK8oOBAh/fnnVPujcgw=',
      }, {
         quoted
      })
   }
   /**
    * 
    * @param {*} jid 
    * @param {*} medias 
    * @param {*} options 
    * @returns 
    */
   conn.sendAlbumMessageV2 = async (jid, medias, options = {}) => {
      for (const media of medias) {
         if (!media.image && !media.video) throw new TypeError('medias[i] must have image or video property')
      }
      const time = options.delay || 500
      delete options.delay
      const album = await generateWAMessageFromContent(jid, {
         albumMessage: {
            expectedImageCount: medias.filter(media => media.image).length,
            expectedVideoCount: medias.filter(media => media.video).length,
            ...options
         }
      }, {
         userJid: conn.user.jid,
         ...options
      })
      await conn.relayMessage(jid, album.message, { messageId: album.key.id })
      let mediaHandle
      let msg
      for (const i in medias) {
         const media = medias[i]
         if (media.image) {
            msg = await generateWAMessage(jid, {
               image: media.image,
               ...media,
               ...options
            }, {
               userJid: conn.user.jid,
               upload: async (readStream, opts) => {
                  const up = await conn.waUploadToServer(readStream, { ...opts, newsletter: isJidNewsletter(jid) })
                  mediaHandle = up.handle
                  return up
               },
               ...options
            })
         } else if (media.video) {
            msg = await generateWAMessage(jid, {
               video: media.video,
               ...media,
               ...options
            }, {
               userJid: conn.user.jid,
               upload: async (readStream, opts) => {
                  const up = await conn.waUploadToServer(readStream, { ...opts, newsletter: isJidNewsletter(jid) })
                  mediaHandle = up.handle
                  return up
               },
               ...options,
            })
         }
         if (msg) {
            msg.message.messageContextInfo = {
               messageSecret: crypto.randomBytes(32),
               messageAssociation: {
                  associationType: 1,
                  parentMessageKey: album.key
               }
            }
         }
         await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
         await Func.delay(time)
      }
      return album
   }
}

Func.updateFile(require.resolve(__filename))