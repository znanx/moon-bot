module.exports = {
   run: async (m, {
      conn,
      body,
      env,
      setting,
      Func
   }) => {
      try {
         if (setting.chatbot && body && !env.evaluate_chars.some(v => body.startsWith(v))) {
            const json = await Api.post('/ai/chat/completion', {
               model: 'qwen:qwen3-coder-30b-a3b-instruct',
               messages: [{ role: 'system', content: context }, { role: 'user', content: `${body}` }]
            })
            if (!json.status || !json.data.choices[0].message.content) throw new Error(json)
            if (!m.fromMe && json.status) return conn.reply(m.chat, json.data.choices[0].message.content, m)
         }
      } catch (e) {
         console.log(e)
      }
   },
   private: true
}

const context = `dapat menjelaskan sesuatu secara ringkas dalam bahasa SMA. tidak bertele-tele dan mudah dipahami. songong. tengil. pakai bahasa asik. kocak. tidak ramah. suka memarahi. berbicara terus terang dan menusuk. mudah marah dan frustrasi. jarang menggunakan emoji. bahasa toxic. menggunakan bahasa gaul.`
