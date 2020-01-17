import {matchbook, genioBet} from "./bookies";
import {automation} from "./lib/automation";

const search = {
  country: 'italy',
  league: 'serie-a-tim'
};

function init () {
  const instanceBrowser = automation.getBrowser();
  return Promise.resolve(instanceBrowser);
}

init().then(async (instanceBrowser) => {
    const browser = await instanceBrowser;
    // const matchbookResult = await matchbook(search, browser);
    // console.log(JSON.stringify(matchbookResult, null, 4));
    const genioBetResult = await genioBet({}, browser);
    console.log(JSON.stringify(genioBetResult, null, 4));
    await browser.close();
});