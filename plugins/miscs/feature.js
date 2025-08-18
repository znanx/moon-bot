module.exports = {
   help: ['feature'],
   aliases: ['fitur'],
   tags: 'miscs',
   run: async (m, {
      conn,
      plugins,
      Func
   }) => {
      conn.reply(m.chat, Func.texted('bold', 'Total features available : [ ' + Func.formatNumber(plugins.size) + ' ]'), m)
   },
   error: false
}