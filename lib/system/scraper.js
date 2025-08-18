const { Function: Func, Scraper } = new (require('@znan/wabot'))
const axios = require('axios')

Scraper.viewpagesource = (url) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await axios.post('https://viewsourcepage.com/wp-admin/admin-ajax.php',
            new URLSearchParams({
               action: "psvAjaxAction",
               url: url,
            }).toString(), {
            headers: {
               "accept": "*/*^",
               "accept-language": "id;q=0.7^",
               "content-type": "application/x-www-form-urlencoded; charset=UTF-8^",
               "origin": "https://viewsourcepage.com^",
               "priority": "u=1, i^",
               "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
               "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36^"
            }
         })
         return resolve({
            creator: global.creator,
            status: true,
            data: {
               result: response.data
            }
         })
      } catch (e) {
         console.log(e)
         return resolve({
            creator: global.creator,
            status: false,
            msg: e
         })
      }
   })
}

Func.updateFile(require.resolve(__filename))