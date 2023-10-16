import {
  matchbook,
  genioBet,
  bet365,
  marathonbet,
  suprabetML,
  suprabetOthers,
  tenbet,
} from "./bookies/index.js";
import { automation } from "./lib/automation.js";
import { arbitrage3Way, arbitrage2Way } from "./arbitrage/index.js";

const search = {
  country: "germany",
  league: "bundesliga",
  // type: 'live',
  type: 'prematch',
  sport: "soccer",
  // market: "overUnder"
};

const leagues = [
  // {
  //   country: "germany",
  //   league: "bundesliga",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
  // {
  //   country: "england",
  //   league: "premier-league",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
  // {
  //   country: "italy",
  //   league: "serie-a",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
  // {
  //   country: "portugal",
  //   league: "primera-liga",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
  {
    country: "usa",
    league: "nba",
    sport: "basketball",
  }
  // {
  //   country: "netherlands",
  //   league: "eredivisie",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
  // {
  //   country: "brazil",
  //   league: "paulista",
  //   type: 'prematch',
  //   sport: "soccer",
  // },
];

// const search = {
//   country: "usa",
//   league: "nba",
//   sport: "basketball",
// };

Object.freeze(search);

function init() {
  const instanceBrowser = automation.getBrowser();
  return Promise.resolve(instanceBrowser);
}

async function getData(leagues, browser) {
  return leagues.map(async (league) => {
    let arbitrageResult;
    const results = await Promise.all([
      suprabetML(league, browser),
      // tenbet(league, browser),
      marathonbet(league, browser),
      matchbook(league, browser)
    ]);
    if (league.sport === 'soccer')
      arbitrageResult = await arbitrage3Way(...results);
    if (league.sport === 'basketball')
      arbitrageResult = await arbitrage2Way(...results);

      return arbitrageResult;
  });
}

init().then(async (instanceBrowser) => {
  const browser = instanceBrowser;
  let arbitrageResult;
  const results = await Promise.all([
    suprabetOthers(search, browser),
    // tenbet(search, browser),
    // marathonbet(search, browser),
    // matchbook(search, browser)
  ]);
  if (search.sport === 'soccer')
    arbitrageResult = await arbitrage3Way(...results);
  if (search.sport === 'basketball')
    arbitrageResult = await arbitrage2Way(...results);

  console.log(JSON.stringify(arbitrageResult, null, 4));
  // const bookmakerTest = await tenbet(search, browser);
  // console.log(JSON.stringify(bookmakerTest, null, 4));
  await browser.close();
});
