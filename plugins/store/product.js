module.exports = [{
   help: ['product'],
   tags: 'store',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      groupSet,
      Func
   }) => {
      try {
         const store = groupSet.product || []
         if (!store.length) return conn.reply(m.chat, Func.texted('bold', '🚩 There is no product in this group yet.'), m)
         if (text) {
            let item = store.find(v => v.id === text.trim())
            if (!item && !isNaN(text.trim())) item = store[parseInt(text.trim()) - 1]
            if (!item) return conn.reply(m.chat, Func.texted('bold', '🚩 Product not found, please use the correct ID or serial number.'), m)

            let txt = `*Name* : ${item.name}\n`
            txt += `*ID* : ${item.id}\n`
            if (item.price) txt += `*Price* : Rp ${item.price.toLocaleString('id-ID')}\n`
            txt += `*Update* : ${new Date(item.lastUpdate).toLocaleString('id-ID')}\n`
            if (item.desc) txt += `*Desc* : ${item.desc}\n`
            if (item.image) {
               let buffer = Buffer.from(item.image.split(',')[1], 'base64')
               return conn.sendFile(m.chat, buffer, Func.filename('jpg'), txt, m)
            } return conn.reply(m.chat, txt, m)
         }

         let textMsg = 'list of products in this group\n\n'
         for (let i = 0; i < store.length; i++) {
            const item = store[i]
            textMsg += `*${i + 1}. ${item.name}*\n`
            textMsg += `*ID* : ${item.id}\n`
            if (item.price) textMsg += `*Price* : Rp${item.price.toLocaleString('id-ID')}\n`
            textMsg += '\n'
         }

         textMsg += `Type ${usedPrefix + command} <id / number> to view product details.`
         conn.reply(m.chat, textMsg, m)
      } catch (e) {
         console.error(e)
      }
   },
   group: true
}, {
   help: ['+product'],
   use: 'name | desc | price',
   tags: 'store',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      groupSet,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'kucing | jawa | 1500000'),)

         const [name, desc, price] = text.split('|').map(v => v?.trim())
         if (!name) return conn.reply(m.chat, '🚩 Product name must be filled in.', m)
         const store = groupSet.product || []
         const id = Func.makeId ? Func.makeId(6) : Math.random().toString(36).substring(2, 8)

         let imageBase64 = null

         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)

         const buffer = await q.download()
         const base64 = buffer.toString('base64')
         imageBase64 = `data:${mime};base64,${base64}`

         const item = {
            id,
            name,
            desc: desc || '',
            price: price ? parseInt(price) : null,
            image: imageBase64,
            lastUpdate: new Date().toISOString()
         }
         store.push(item)
         groupSet.product = store

         conn.reply(m.chat, `✅ Product *${name}* has been successfully added with ID *${id}*`, m)
      } catch (e) {
         console.error(e)
      }
   },
   group: true,
   admin: true
}, {
   help: ['-product'],
   use: 'id',
   tags: 'store',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      groupSet,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'JKWAJG'), m)

         const store = groupSet.product || []
         const index = store.findIndex(v => v.id === text.trim() || v.name.toLowerCase() === text.toLowerCase())
         if (index < 0) return conn.reply(m.chat, '🚩 The product with that ID or name was not found.', m)

         const removed = store.splice(index, 1)[0]
         groupSet.product = store

         conn.reply(m.chat, `✅ The product *${toUppercase(removed.name)}* has been removed.`, m)
      } catch (e) {
         console.error(e)
      }
   },
   group: true,
   admin: true
}, {
   help: ['^product'],
   use: 'id | name | desc | price',
   tags: 'store',
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      groupSet,
      Func
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'id | name | desc | price'), m)
         const [id, name, desc, price] = text.split('|').map(v => v?.trim())
         const store = groupSet.product || []
         const item = store.find(v => v.id === id)
         if (!item) return conn.reply(m.chat, '🚩 The product with that ID or name was not found.', m)

         if (name) item.name = name
         if (desc) item.desc = desc
         if (price) item.price = parseInt(price)

         if (m.quoted && m.quoted.mimetype && m.quoted.mimetype.startsWith('image/')) {
            const buffer = await m.quoted.download()
            const base64 = buffer.toString('base64')
            item.image = `data:${m.quoted.mimetype};base64,${base64}`
         }

         item.lastUpdate = new Date().toISOString()
         groupSet.product = store
         conn.reply(m.chat, `✅ The *${item.name}$ product has been successfully updated.`, m)
      } catch (e) {
         console.error(e)
      }
   },
   group: true,
   admin: true
}]
