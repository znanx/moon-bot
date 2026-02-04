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
            const json = await Api.post('/ai/completions', {
               model: 'zai-org/GLM-4.6',
               messages: JSON.stringify([{ role: 'system', content: 'Be a helpful assistant' }, { role: 'user', content: `${body}` }])
            })
            if (!json.status) throw new Error(json)
            if (!m.fromMe && json.status) return conn.replyAI(m.chat, json.data.choices[0].message.content, m)
         }
      } catch (e) {
         console.log(e)
      }
   },
   private: true
}