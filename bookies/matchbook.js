const puppeteer = require('puppeteer');

import {moneyExchange, extractDate} from "../utils";

export const matchbook = async (search = {}) => {
  const sport = search.sport || 'soccer';
  const country = search.country || 'england';
  const league = search.league || 'premier-league';
  let searchList;

  // Show browser
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.matchbook.com/events/'+sport+'/'+country+'/'+league);

  await page.waitForSelector("#app-next > div > div.mb-app__containerChildren > div > div > div.mb-events > div:nth-child(2) > div.mb-events__list > div:nth-child(1) > div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG");

  const matchesList = await page.$$("#app-next > div > div.mb-app__containerChildren > div:nth-child(1) > div > div.mb-events > div:nth-child(2) > div.mb-events__list .mb-event-slide-animation-enter-done");

  searchList = await Promise.all(matchesList.map(async match => {
      // DATE AND LEAGUE
      const headerTag = await match.$eval("div:nth-child(1) > div > span.EventHeader__start___2Xn2h", element => element.textContent);
      const headerSplit = headerTag.split('|');

      let date = headerSplit[0].trim() || '';
      date = extractDate(date);
      const league = headerSplit[1].trim() || '';

      // GAME
      const gameName = await match.$eval("div:nth-child(1) > div > a > h1", element => element.textContent);
      const gameLink = await match.$eval("div:nth-child(1) > div > a", element => element.href);

      // VS
      // TEAM1
      const team1Name = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > div > div.Runner__info___21Pwe > span > h4.ClippableString__variable___38RDR", element => element.textContent);

      // BACK
      const team1Back = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const team1BackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);

      // LAY
      const team1Lay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const team1LayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);


      // TEAM2
      const team2Name = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > div > div.Runner__info___21Pwe > span > h4.ClippableString__variable___38RDR", element => element.textContent);

      // BACK
      const team2Back = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const team2BackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);

      // LAY
      const team2Lay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const team2LayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);


      // BACK
      const drawBack = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const drawBackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);

      // LAY
      const drawLay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      const drawLayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);

      return {
        league,
        game: gameName,
        link: gameLink,
        date,
        vs: {
          team1: {
            name: team1Name,
            back: {
              odd: parseFloat(team1Back),
              liquidity: parseFloat(await moneyExchange(team1BackLiquidity))
            },
            lay: {
              odd: parseFloat(team1Lay),
              liquidity: parseFloat(await moneyExchange(team1LayLiquidity))
            }
          },
          team2: {
            name: team2Name,
            back: {
              odd: parseFloat(team2Back),
              liquidity: parseFloat(await moneyExchange(team2BackLiquidity))
            },
            lay: {
              odd: parseFloat(team2Lay),
              liquidity: parseFloat(await moneyExchange(team2LayLiquidity))
            }
          },
          draw: {
            name: 'draw',
            back: {
              odd: parseFloat(drawBack),
              liquidity: parseFloat(await moneyExchange(drawBackLiquidity))
            },
            lay: {
              odd: parseFloat(drawLay),
              liquidity: parseFloat(await moneyExchange(drawLayLiquidity))
            }
          }
        }
      };
    })
  );

  await page.screenshot({path: 'match.png'});
  browser.close();
  return searchList;
};