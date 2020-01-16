const puppeteer = require('puppeteer');

// BOOKIE GENIOBET
let geniobet = async (match) => {
  // Show browser
  const browser = await puppeteer.launch({headless: false});
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.geniobet.com/#/sport/');

  await page.waitForSelector('.search-box-v3');

  if (menu) {
    console.log(menu);
  }

  await page.type('body > div.body-wrapper.lang-spa.sport.theme-.Geniobet.wwwgeniobetcom.classic.footer-movable > div.view-container.sport > div > div > div > div > div > div.left-column-v3.live > div > div.l-t-box > div.filter-view-v3 > div.second-row-filter-v3 > include-template > form > div > input', match);

  // Wait search box
  await page.waitForSelector("body > div.body-wrapper.lang-spa.sport.theme-.Geniobet.wwwgeniobetcom.classic.footer-movable > div.view-container.sport > div > div > div > div > div > div.left-column-v3.live > div > div.l-t-box > div.filter-view-v3 > div.second-row-filter-v3 > include-template > form > div > div");

  await page.click(".result-search > dd:nth-child(1) > button");

  console.log(page);


  // // Wait lay price
  // await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG");

  // // Back Odds
  // const backLocalOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG");
  // const backVisitorOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG");
  // const backDrawOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG");
  //
  // // Lay Odds
  // const layLocalOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG");
  // const layVisitorOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG");
  // const layDrawOdd = await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > main > div > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG");
  //
  // result = {
  //   back: {
  //     local: parseFloat(await page.evaluate(element => element.textContent, backLocalOdd)),
  //     visitor: parseFloat(await page.evaluate(element => element.textContent, backVisitorOdd)),
  //     draw: parseFloat(await page.evaluate(element => element.textContent, backDrawOdd)),
  //   },
  //   lay: {
  //     local: parseFloat(await page.evaluate(element => element.textContent, layLocalOdd)),
  //     visitor: parseFloat(await page.evaluate(element => element.textContent, layVisitorOdd)),
  //     draw: parseFloat(await page.evaluate(element => element.textContent, layDrawOdd)),
  //   }
  // }

  await page.screenshot({path: 'match.png'});
  browser.close();
  return result;
};