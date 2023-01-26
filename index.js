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
  country: "england",
  league: "premier-league",
  // type: 'live',
  type: 'prematch',
  sport: "soccer",
  market: "overUnder"
};

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
