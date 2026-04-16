module.exports = {
   help: ['metatable', 'metacode', 'metafile'],
   tags: 'example',
   run: async (m, {
      conn,
      command
   }) => {
      switch (command) {
         case 'metatable': {
            await conn.metaSnippet(m.chat, {
               text: 'Product List',
               table: {
                  headers: ['Product', 'Price', 'Stock'],
                  rows: [
                     ['VPS 1GB', '15000', '12'],
                     ['VPS 2GB', '25000', '7']
                  ]
               }
            }, m)
         }
         break
         case 'metacode': {
            await conn.metaSnippet(m.chat, {
               text: 'Example Code JavaScript:',
               code: "const hello = 'world'\\nconsole.log(hello)"
            }, m)
         }
         break
         case 'metafile': {
            await conn.metaSnippet(m.chat, {
               text: 'Example File getfile.js:',
               code: {
                  file: './plugins/owner/getfile.js'
               }
            }, m)
         }
         break
      }
   },
   error: false
}
