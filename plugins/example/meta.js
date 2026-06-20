module.exports = {
   help: ['metatext', 'metatable', 'metacode', 'metamuted', 'metasuggest', 'metasource', 'metareels', 'metaposts', 'metaproduct', 'metamedia', 'metamix'],
   tags: 'example',
   run: async (m, {
      conn,
      command,
      setting,
      env
   }) => {
      switch (command) {

         case 'metatext': {
            conn.metaSnippet(m.chat,
               `Hi!
### Markdown support
Hyperlink: [Google](https://google.com)
Citation: [](https://openai.com)
LaTeX: [moonbot|1429|1897]<https://cdn.ornzora.eu.cc/a3a756f2-6bb8-4814-a024-c325524a2308-FIORA.png>`,
               m, {
               title: global.header
            })
         }
         break

         case 'metatable': {
            conn.metaSnippet(m.chat, [
               {
                  table: {
                     title: 'List',
                     headers: ['Name', 'Strength'],
                     rows: [
                        ['Asta', 'Anti-magic'],
                        ['Yuno', 'Magic']
                     ]
                  }
               }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metacode': {
            conn.metaSnippet(m.chat, [
               { text: 'Inline code :' },
               { code: "const hello = 'world'\nconsole.log(hello)", language: 'javascript' },
               { text: '\n' },
               { text: 'Code from file (auto-detect language) :' },
               { code: './package.json' },
               { text: '\n' },
               { text: 'Code from file + explicit language :' },
               { code: './replit.nix', language: 'nix' }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metamuted': {
            conn.metaSnippet(m.chat, [
               { text: 'Normal text here' },
               { muted: 'This is muted / secondary text' }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metasuggest': {
            conn.metaSnippet(m.chat, [
               { text: 'Choose one :' },
               { suggestions: ['Asta', 'Yuno'] }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metasource': {
            conn.metaSnippet(m.chat, [
               { text: 'Useful links :' },
               {
                  sources: [
                     { icon: 'https://www.google.com/favicon.ico', title: 'Google', url: 'https://google.com' },
                     { icon: 'https://github.com/favicon.ico', title: 'GitHub', url: 'https://github.com' }
                  ]
               }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metareels': {
            conn.metaSnippet(m.chat, [
               { text: 'Random reels :' },
               {
                  reels: [
                     'https://i.pinimg.com/736x/c0/da/3c/c0da3c1c8127c678eba75ffe9bb101a5.jpg',
                     'https://i.pinimg.com/736x/66/79/8d/66798d31a8e67fe58b23fae3d869b3d9.jpg',
                     'https://i.pinimg.com/736x/bf/77/fa/bf77fab7a4cda45e0b70fc66875fc6fe.jpg',
                     'https://i.pinimg.com/736x/e1/1b/f6/e11bf6fe1aa10ae3b633a0bcbb6c1bcc.jpg',
                     'https://i.pinimg.com/736x/82/18/ed/8218ed2750542ecad90b71c412200a20.jpg'
                  ].map(image => ({
                     creator: 'Moon Automatic',
                     avatar: 'https://i.pinimg.com/736x/01/8d/14/018d14227c267f1c00dd99938e355569.jpg',
                     verified: true,
                     thumbnail: image,
                     url: 'https://alyachan.dev',
                     source: 'IG'
                  }))
               }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metaposts': {
            conn.metaSnippet(m.chat, [
               { text: 'Social media posts :' },
               {
                  posts: [{
                     media: 'https://i.pinimg.com/736x/e1/2d/b0/e12db0eb7dba391aff0fa13a2feb7a3c.jpg',
                     caption: 'Lorem ipsum dolor sit amet.',
                     source: 'FACEBOOK'
                  }, {
                     media: 'https://i.pinimg.com/736x/95/1a/0f/951a0f9e25ac94599f5305bef4aecf47.jpg',
                     caption: 'Lorem ipsum dolor sit amet.',
                     source: 'THREADS'
                  }, {
                     media: 'https://i.pinimg.com/736x/c6/60/1c/c6601ce8d808999b5e3150919201dc0e.jpg',
                     caption: 'Lorem ipsum dolor sit amet.',
                     source: 'INSTAGRAM'
                  }].map(v => ({
                     username: 'Moon Automatic',
                     avatar: 'https://i.pinimg.com/736x/01/8d/14/018d14227c267f1c00dd99938e355569.jpg',
                     verified: true,
                     caption: v.caption,
                     url: 'https://alyachan.dev',
                     thumbnail: v.media,
                     source: v.source,
                     post_type: 'PHOTO'
                  }))
               }
            ], m, { 
               title: global.header 
            })
         }
         break

         case 'metaproduct': {
            conn.metaSnippet(m.chat, [
               { text: 'Single product :' },
               {
                  product: {
                     title: 'Pygmy Goat',
                     brand: 'Moon Automatic',
                     price: 'Rp 50.000.000',
                     sale_price: 'Rp 45.000.000',
                     url: 'https://wa.me/' + env.owner,
                     image: 'https://i.pinimg.com/736x/b3/f1/ac/b3f1ac8a91d2576b675347a17167cccc.jpg'
                  }
               },
               { text: '\n' },
               { text: 'Multiple products (carousel) :' },
               {
                  products: [
                     {
                        title: 'Hamster',
                        price: 'Rp 50.000',
                        sale_price: 'Rp 45.000',
                        brand: 'Moon Automatic',
                        url: 'https://wa.me/' + env.owner,
                        image: 'https://i.pinimg.com/1200x/bf/05/08/bf0508b667569abbaad333932c3a410c.jpg'
                     },
                     {
                        title: 'Love Bird',
                        price: 'Rp 2.000.000',
                        sale_price: 'Rp 1.900.000',
                        brand: 'Moon Automatic',
                        url: 'https://wa.me/' + env.owner,
                        image: 'https://i.pinimg.com/736x/61/75/30/61753029a3114339b58e3ad25127a6c0.jpg'
                     }
                  ]
               }
            ], m, { 
               title: global.header
            })
         }
         break

         case 'metamedia': {
            conn.metaSnippet(m.chat, [
               { image: setting.cover },
               {
                  video: {
                     url: 'https://cdn.ornzora.eu.cc/5c3e1109-38d3-408e-926c-588694fd9581-FIORA.mp4',
                     mime_type: 'video/mp4'
                  }
               }
            ], m, {
               title: global.header
            })
         }
         break

         case 'metamix': {
            conn.metaSnippet(m.chat, [
               { header: 'Custom Header Title' },
               { text: 'Text with [link](https://google.com) support dan [citations](https://openai.com).' },
               { text: '\n' },
               { code: 'console.log("hello world")', language: 'javascript' },
               { text: '\n' },
               {
                  table: {
                     title: 'Sample Data',
                     headers: ['Key', 'Value'],
                     rows: [['name', 'Lily'], ['age', '12']]
                  }
               },
               { muted: 'Additional info here' },
               { text: '\n' },
               { suggestions: ['Yes', 'No', 'Maybe'] },
               { text: '\n' },
               { sources: [{ icon: 'https://github.com/favicon.ico', title: 'GitHub', url: 'https://github.com' }] },
               { footer: global.footer }
            ], m, { 
               title: global.header
            })
         }
         break
      }
   },
   error: false
}
