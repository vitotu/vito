const https = require('https');
const cheerio = require('cheerio');
const { HttpsProxyAgent } = require('https-proxy-agent');

const configData = require('../envConfig.json');
const mode = process.env.target || 'dev'
const config = configData[mode]

const options = {
  agent: new HttpsProxyAgent(config.proxy)
}

// var arguments = process.argv.splice(2);

// check arguments
// if (arguments.length <= 1) console.error('至少两个参数');

// let mode = arguments[0], param = arguments[1];


/**
 * @description: 解析主页 获取所有可用号码 for sms24.me
 * @param {*}
 * @return {*}
 */
exports.parseMainPage = function(data){
  let result = null
  const $ = cheerio.load(data);
  const reg = /[A-Za-z]+\+[0-9]+/g
  const targetStr = $('div.col-sm-12').has('div.fw-bold').text();
  result = targetStr.replace(/[\r\n\ ]/g , '').matchAll(reg)
  result = Array.from(result, i => i[0]).map(i=>{
    let temp = i.split('+');
    return {'country':temp[0], 'number':temp[1], 'source':i}
  })
  return result;
}

function getNewNumber(nums){
  // do diff
  let first = nums[0];
  https.get(getNumberUrl(first.number), r=>{
    let list = [];
    r.on('data', c =>{
      list.push(c);
    })
    r.once('end', ()=>{
      const htmlString = Buffer.concat(list).toString();
      let result = parseNumber(htmlString);
      console.log(result);
    })
  })
}


/**
 * @description: 解析号码页 获取号码信息 for sms24.me
 * @param {*}
 * @return {*}
 */
function parseNumber(data){
  const $ = cheerio.load(data);
  return {
    "number": $('h1.text-secondary').text(),
    "lastSMSs": $('dd.shadow-sm').text().split('From:').map(i => i.replace(/[\s\n\ ]+/g, ''))
  } 
}
exports.parseNumber = parseNumber
// diff parse new numbers
exports.diff2Array = function(newArray, oldArray){
  let result = newArray.filter(i => oldArray.every(j=> i.source !== j.source));
  return result;
}
// load and parse new numbers last sms info

// out put result

function getNumberUrl(targetNumber){
  return `https://sms24.me/en/numbers/${targetNumber}`;
}

function getUrl(){
  if(mode === 'home') return config.mainPath;
  else if(mode === 'number') return getNumberUrl(param);
  else throw new Error('Invalid mode parameters(home/number)');
}
function getDataByUrl(url){
  return new Promise((resolve, reject)=>{
    const req = https.get(url, options ,r=>{
      let list = [];
      r.on('data', d=>list.push(d));
      r.on('end', ()=>{
        const { statusCode, headers } = r;
        const validRes = statusCode >= 200 && statusCode <= 209;
        const body = Buffer.concat(list).toString();
        if(validRes) resolve({statusCode, headers, body})
        else reject(new Error('request failed'))
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })
}
exports.getDataByUrl = getDataByUrl;
async function run(){
  let [res, err] = await getDataByUrl(getUrl()).then(r => [r, null], e => [null, e]);
  if(err) return;
  let result = null;
  if(mode === 'home'){
    result = parseMainPage(res.body);
    console.log('home page numbers:', result.map(i=>i.source));
  } else if(mode === 'number'){
    result = parseNumber(res.body);
    console.log('last sms:',result);
  } else throw new Error('Invalid mode parameters');

  if(mode === "home" && param === 'alive'){
    let count = 0;
    setInterval(async ()=>{

      let [resNew, errNew] = await getDataByUrl(config.mainPath).then(r => [r, null], e => [null, e]);
      if(errNew) return;
      let resultNew = parseMainPage(resNew.body);
      // do diff
      let diffNumbers = diff2Array(resultNew, result);
      process.stdout.write(`+${count++}`);
      if(diffNumbers.length > 0) console.log((`new nums:${diffNumbers.map(i=>i.source)}`).green)
      diffNumbers.forEach(i => {
        getDataByUrl(getNumberUrl(i.number)).then(res => {
          console.log(i.number, 'last sms:', parseNumber(res.body))
        })
      })
      result = resultNew;
    }, 5000)
  }
}

async function test() {
  let [res, err] = await getDataByUrl(config.mainPath).then(r => [r, null], e => [null, e])
  console.log(res, err)
}
// test()
// run();