// < Working login code, but triggers 2fa for each browser session >

// import { Builder, By, Key, until } from 'selenium-webdriver';

// (async function example() {
//   let driver = await new Builder().forBrowser('chrome').build();
//   // try {
//     console.log(driver);
//     await driver.get('https://appstoreconnect.apple.com/login');
//     await driver.sleep(5000)
//     await driver.switchTo().frame(driver.findElement(By.xpath("//iframe")));
//     await driver.findElement(By.className("form-choice-checkbox")).click();
//     await driver.findElement(By.xpath("//input")).sendKeys('val@antarestech.com', Key.RETURN);
//     await driver.sleep(1000)
//     await driver.findElement(By.xpath("//input")).sendKeys(Key.RETURN);
//     await driver.sleep(3000);
//     await driver.switchTo().activeElement().sendKeys('T3$T1ng!');
//     await driver.switchTo().activeElement().sendKeys(Key.RETURN);
  
//   // }
//   // finally {
//   //   await driver.wait(until.ableToSwitchToFrame(0), 10000);
//   // }
// })();

// </ Working login code, but triggers 2fa for each browser session >



















// console.log("🏃 appStoreConnectAPIFromNode.js running 🏃‍")
// // After the token is generated, access the API by running: `curl -v -H 'Authorization: Bearer [token]' "[endpoint]"`

// import fs from 'fs';
// import jwt from 'jsonwebtoken';
// import https from 'https';
// import issuerID from './issuerId.mjs';
// import apiKey from './apiKeyId.mjs';

// // You get privateKey, apiKeyId and issuerId from your Apple App Store Connect account
// const privateKey = fs.readFileSync('./AuthKey_KP794PJUDZ.p8').toString(); // this is the file you can only download once and should treat like a real, very precious key.
// const apiKeyId = apiKey.apiKey;
// const issuerId = issuerID.issuerID;

// let now = Math.round((new Date()).getTime() / 1000); // Notice the /1000 
// let nowPlus20 = now + 1199 // 1200 === 20 minutes

// let payload = {
//     "iss": issuerId,
//     "exp": nowPlus20,
//     "aud": "appstoreconnect-v1"
// };

// let signOptions = {
//     "algorithm": "ES256", // you must use this algorythm, not jsonwebtoken's default
//     header : {
//         "alg": "ES256",
//         "kid": apiKeyId,
//         "typ": "JWT"
//     }
// };

// let token = jwt.sign(payload, privateKey, signOptions);

// var options = {
//     host: 'api.appstoreconnect.apple.com',
//     path: '/v1/apps',
//     method: 'GET',
//     headers: {
//         'Accept': 'application/a-gzip, application/json',
//         'Authorization': `Bearer${token}`
//     }
// };

// var req = https.request(options, function(res) {
//     res.setEncoding('utf8');
//     console.log('STATUS:' + res.statusCode);
//     console.log('HEADERS:' + JSON.stringify(res.headers));
//     res.on('data', function(chunk) {
//         console.log('BODY:' + chunk);
//     });
// });

// req.on('error', function(e){
//     console.log('problem with request:' + e.message);
// });

// req.end();
// console.log('@token: ', token);
// console.log('@privateKey: ', privateKey);