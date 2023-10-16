import {extractDate} from "../utils/index.js";

// BET365
export const bet365 = async (search = {}, instanceNavigator) => {
  const browser = await instanceNavigator;
  const sport = search.sport || 'B1';
//   const country = search.country || 'england';
  const league = search.league || 'C1/D1002/E76509991/G40/'; // Italy Serie A
  let searchList;

  try {
    if (!league) return [];
    const page = await browser.newPage();

    await page.goto(`https://www.bet365.com/#/AC/${sport}/${league}`);

    // Check if the data was loaded
    await page.waitForSelector("body > div:nth-child(1) > div > div.wc-WebConsoleModule_SiteContainer > div.wc-PageView > div.wc-PageView_Main.wc-CouponPageResponsive_PageViewMain > div > div.wcl-PageContainer.wcl-PageContainer-scrollable > div.wcl-PageContainer_Colcontainer > div > div > div.cm-CouponModule > div > div > div.src-MarketGroup > div.gl-MarketGroup_Wrapper.src-MarketGroup_Container > div > div.sgl-MarketFixtureDetailsLabel.gl-Market_General.gl-Market_General-columnheader.gl-Market_General-haslabels.gl-Market_General-pwidth46-74 > div:nth-child(2) > div.rcl-ParticipantFixtureDetailsAggregateScore_LhsContainer > div > div.rcl-ParticipantFixtureDetailsAggregateScore_TeamAndScoresContainer > div > div:nth-child(1) > div.rcl-ParticipantFixtureDetailsTeam_TeamName");

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
    return searchList;
  } catch (e) {
    console.log(e);
  } finally {
    if (browser) await browser.disconnect();
  }
};