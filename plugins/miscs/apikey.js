module.exports = {
   help: ['apikey'],
   run: async (m, {
      conn,
      Func
   }) => {
      const json = await Api.get('/auth/key')
      return m.reply(Func.jsonFormat(json))
   },
   error: false
}