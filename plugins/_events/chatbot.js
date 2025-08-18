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
            const json = await Api.post('/completions', {
               model: 'cognitivecomputations/dolphin-2.9.1-llama-3-70b',
               messages: JSON.stringify([{ role: 'system', content: 'Be a helpful assistant' }, { role: 'user', content: `${body}` }])
            })
            if (!json.status) return console.log(json)
            if (!m.fromMe && !m.isGroup && json.status) return conn.replyAI(m.chat, json.data.choices[0].message.content, m)
         }
      } catch (e) {
         console.log(e)
      }
   },
   private: true,
   error: false
}