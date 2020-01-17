import {moneyExchange, extractDate} from "../utils";
import {BOOKIES} from "../lib/constants";

// BOOKIE GENIOBET
export const genioBet = async (search = {}, instanceNavigator) => {
  const bookie = BOOKIES.GENIOBET;
  const browser = await instanceNavigator;
  const sport = search.sport || 1;
  const country = search.country || 1170001;
  const league = search.league || 543;
  let searchList;

  const page = await browser.newPage();

  await page.goto(`https://www.geniobet.com/#/sport/?type=0&competition=${league}&game=15951347&sport=${sport}&region=${country}`);

  // Check if the data was loaded
  await page.waitForSelector("body > div.body-wrapper.lang-spa.sport.theme-.Geniobet.wwwgeniobetcom.classic.footer-movable > div.view-container.sport > div > div > div > div > div > div.center-column-v3.prematch > div > div.prematch-games-list.Soccer > div.prematch-list-view-v3.prematch > div.prematch-game-view-contain-v3 > div:nth-child(2) > div:nth-child(2) > div.mini-title-box-gameview-v3");

  // body > div.body-wrapper.lang-spa.theme-.Geniobet.wwwgeniobetcom.classic.sport.footer-movable > div.view-container.sport > div > div > div > div > div > div.center-column-v3.prematch > div > div.prematch-games-list.Soccer > div.prematch-list-view-v3.prematch > div.prematch-game-view-contain-v3 > div:nth-child(2)

  const matchesList = await page.$$("body > div.body-wrapper.lang-spa.theme-.Geniobet.wwwgeniobetcom.classic.sport.footer-movable > div.view-container.sport > div > div > div > div > div > div.center-column-v3.prematch > div > div.prematch-games-list.Soccer > div.prematch-list-view-v3.prematch > div.prematch-game-view-contain-v3 > .time-info-game-box-v3");



  searchList = await Promise.all(matchesList.map(async match => {
      // DATE AND LEAGUE

      const headerTag = await match.$eval("div.time-title-view-v3 > p > span", element => element.textContent);
      const date = extractDate(bookie, headerTag);

      return date;

      // // GAME
      // const gameName = await match.$eval("div:nth-child(1) > div > a > h1", element => element.textContent);
      // const gameLink = await match.$eval("div:nth-child(1) > div > a", element => element.href);
      //
      // // VS
      // // TEAM1
      // const team1Name = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > div > div.Runner__info___21Pwe > span > h4.ClippableString__variable___38RDR", element => element.textContent);
      //
      // // BACK
      // const team1Back = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const team1BackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      // // LAY
      // const team1Lay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const team1LayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(1) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      //
      // // TEAM2
      // const team2Name = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > div > div.Runner__info___21Pwe > span > h4.ClippableString__variable___38RDR", element => element.textContent);
      //
      // // BACK
      // const team2Back = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const team2BackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      // // LAY
      // const team2Lay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const team2LayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(2) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      //
      // // BACK
      // const drawBack = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const drawBackLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__back___3Gwg5.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      // // LAY
      // const drawLay = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__odds___1dmQG", element => element.textContent);
      // const drawLayLiquidity = await match.$eval("div.Event__markets___BASQj > div:nth-child(1) > div.Market__runners___2iLqk > div:nth-child(3) > a.Price__price___3UAJu.Price__lay___vOMZN.Price__level-0___2pByH > span.Price__amount___32k6W", element => element.textContent);
      //
      // return {
      //   league,
      //   game: gameName,
      //   link: gameLink,
      //   date,
      //   vs: {
      //     team1: {
      //       name: team1Name,
      //       back: {
      //         odd: parseFloat(team1Back),
      //         liquidity: parseFloat(await moneyExchange(team1BackLiquidity))
      //       },
      //       lay: {
      //         odd: parseFloat(team1Lay),
      //         liquidity: parseFloat(await moneyExchange(team1LayLiquidity))
      //       }
      //     },
      //     team2: {
      //       name: team2Name,
      //       back: {
      //         odd: parseFloat(team2Back),
      //         liquidity: parseFloat(await moneyExchange(team2BackLiquidity))
      //       },
      //       lay: {
      //         odd: parseFloat(team2Lay),
      //         liquidity: parseFloat(await moneyExchange(team2LayLiquidity))
      //       }
      //     },
      //     draw: {
      //       name: 'draw',
      //       back: {
      //         odd: parseFloat(drawBack),
      //         liquidity: parseFloat(await moneyExchange(drawBackLiquidity))
      //       },
      //       lay: {
      //         odd: parseFloat(drawLay),
      //         liquidity: parseFloat(await moneyExchange(drawLayLiquidity))
      //       }
      //     }
      //   }
      // };
    })
  );

  await page.screenshot({path: 'geniobet.png'});
  browser.disconnect();
  return searchList;
};