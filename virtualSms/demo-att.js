const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

https.get('https://sms24.me/en/numbers/13322013074', res=>{
  let list = [];  
  res.on('data', c => {
    list.push(c);
  });
  res.once('end', () => {
    const htmlString = Buffer.concat(list).toString();
    const $ = cheerio.load(htmlString);
    const result = $.html();
    console.log(Object.prototype.toString.call(result));
    fs.writeFile('result.json', JSON.stringify({'data':result}), e=>{
      console.log('write result.json error: ' + e);
    })
    // console.log($.html());
  })
}).on('error', err => {
  console.error(err);
})