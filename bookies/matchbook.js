import {
  extractDate,
  nameFormatter,
  moneyExchange,
  debugElementHandler,
} from "../utils/index.js";
import { CONFIG, BOOKIES } from "../lib/constants.js";
import {
  unifiedNameFinder,
  unifiedLeaguesFinder,
  unifiedSportsFinder,
} from "../lib/unified/index.js";

// MATCHBOOK
export const matchbook = async (search = {}, instanceNavigator) => {
  const browser = await instanceNavigator;
  const bookieSearch = Object.assign({}, search);
  const country = bookieSearch.country;
  const bookmaker = BOOKIES.MATCHBOOK;
  const sport = unifiedSportsFinder(bookmaker, bookieSearch.sport);
  let league = "";
  if (bookieSearch.type !== "live") {
    league = unifiedLeaguesFinder(bookmaker, country, bookieSearch.league);
  }
  bookieSearch.bookmaker = bookmaker;
  let searchList;
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(CONFIG.pageTimeout);
  let url = "";

  try {
    if (bookieSearch.type === "live") {
      url = `http://51.89.232.96/events/${sport}#in-play`;
    } else if (bookieSearch.sport === "basketball") {
      url = `http://51.89.232.96/events/${sport}/${league}`;
    } else url = `http://51.89.232.96/events/${sport}/${country}/${league}`;

    await page.goto(url);

    // Check if the data was loaded, check the banner
    await page.waitForSelector(
      "#root > div > div.RightSidebar__main___LaFmQ > div:nth-child(3) > div"
    );

    // Waiting time in order to load all the data
    await page.waitForTimeout(CONFIG.timeout);

    const matchesList = await page.$$("div.Event-module__main___ubU9Q");

    // debugElementHandler(matchesList);

    searchList = await Promise.all(
      matchesList.map(async (match) => {
        if (
          bookieSearch.sport.toLowerCase() === "soccer" &&
          bookieSearch.type === "live"
        )
          return soccerScrapingLive(match, bookieSearch);
        if (bookieSearch.sport.toLowerCase() === "soccer")
          return soccerScraping(match, bookieSearch);
        if (bookieSearch.sport.toLowerCase() === "basketball")
          return basketballScraping(match, bookieSearch);
      })
    );

    await page.screenshot({ path: `${bookieSearch.bookmaker}.png` });
    return searchList;
  } catch (e) {
    console.log(e);
  } finally {
    await page.close();
  }
};

const soccerScraping = async (match, search) => {
  // DATE AND LEAGUE

  const matchDate = await match.$eval(
    "h2 > div > span:nth-child(1)",
    (element) => element.textContent
  );

  const matchTime = await match.$eval(
    "h2 > div > span:nth-child(2)",
    (element) => element.textContent
  );

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME

  const gameLink = await match.$eval("h2 > a", (element) => element.href);

  const isLiveBetting = await match
    .$eval("h2 > div > span:nth-child(2) > svg", () => true)
    .catch(() => false);

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "h2 > a > span > div:nth-child(1)",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const team1BackLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // LAY

  const team1Lay = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team1LayLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  let team2Name = await match.$eval(
    "h2 > a > span > div:nth-child(2)",
    (element) => element.textContent
  );

  team2Name = team2Name.replace("  vs  ", "");

  // // BACK
  const team2Back = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team2BackLiquidity = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // LAY
  const team2Lay = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team2LayLiquidity = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // DRAW

  // // BACK
  const drawBack = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const drawBackLiquidity = await match.$eval(
    "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(2)",
    (element) => element.textContent
  );

  // // LAY
  const drawLay = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const drawLayLiquidity = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const team1NameFormatted = nameFormatter(team1Name);
  const team2NameFormatted = nameFormatter(team2Name);

  const gameName = `${team1NameFormatted}-vs-${team2NameFormatted}`;

  const unifiedNameTeam1 = unifiedNameFinder(
    search.sport.toLowerCase(),
    search.country.toLowerCase(),
    team1NameFormatted
  );
  const unifiedNameTeam2 = unifiedNameFinder(
    search.sport.toLowerCase(),
    search.country.toLowerCase(),
    team2NameFormatted
  );

  const unifiedGameName = `${unifiedNameTeam1}-vs-${unifiedNameTeam2}`;

  return {
    league: search.league,
    game: gameName,
    unifiedGameName,
    link: gameLink,
    date: "",
    bookmaker: search.bookmaker,
    isLiveBetting,
    match: {
      team1: {
        name: team1Name,
        back: {
          odd: parseFloat(team1Back),
          liquidity: parseFloat(await moneyExchange(team1BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team1Lay),
          liquidity: parseFloat(await moneyExchange(team1LayLiquidity)),
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
          liquidity: parseFloat(await moneyExchange(team2BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team2Lay),
          liquidity: parseFloat(await moneyExchange(team2LayLiquidity)),
        },
      },
      draw: {
        name: "X",
        back: {
          odd: parseFloat(drawBack),
          liquidity: parseFloat(await moneyExchange(drawBackLiquidity)),
        },
        lay: {
          odd: parseFloat(drawLay),
          liquidity: parseFloat(await moneyExchange(drawLayLiquidity)),
        },
      },
    },
  };
};

const soccerScrapingLive = async (match, search) => {
  // DATE AND LEAGUE

  const matchDate = await match.$eval(
    "h2 > div > span:nth-child(1)",
    (element) => element.textContent
  );

  const matchTime = await match.$eval(
    "h2 > div > span:nth-child(2)",
    (element) => element.textContent
  );

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME

  const gameLink = await match.$eval("h2 > a", (element) => element.href);

  const isLiveBetting = await match
    .$eval("h2 > div > span:nth-child(2) > svg", () => true)
    .catch(() => false);

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "h2 > a > span > div:nth-child(1)",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const team1BackLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // LAY

  const team1Lay = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team1LayLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  let team2Name = await match.$eval(
    "h2 > a > span > div:nth-child(2)",
    (element) => element.textContent
  );

  team2Name = team2Name.replace("  vs  ", "");

  // // BACK
  const team2Back = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team2BackLiquidity = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // LAY
  const team2Lay = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const team2LayLiquidity = await match
    .$eval(
      "div > div:nth-child(3) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // DRAW

  // // BACK
  const drawBack = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const drawBackLiquidity = await match.$eval(
    "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(2)",
    (element) => element.textContent
  );

  // // LAY
  const drawLay = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(1)",
      (element) => element.textContent
    )
    .catch(() => 0);
  const drawLayLiquidity = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const team1NameFormatted = nameFormatter(team1Name);
  const team2NameFormatted = nameFormatter(team2Name);

  const gameName = `${team1NameFormatted}-vs-${team2NameFormatted}`;

  const unifiedGameName = `${team1NameFormatted}-vs-${team2NameFormatted}`;

  return {
    league: search.league,
    game: gameName,
    unifiedGameName,
    link: gameLink,
    date: "",
    bookmaker: search.bookmaker,
    isLiveBetting,
    match: {
      team1: {
        name: team1Name,
        back: {
          odd: parseFloat(team1Back),
          liquidity: parseFloat(await moneyExchange(team1BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team1Lay),
          liquidity: parseFloat(await moneyExchange(team1LayLiquidity)),
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
          liquidity: parseFloat(await moneyExchange(team2BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team2Lay),
          liquidity: parseFloat(await moneyExchange(team2LayLiquidity)),
        },
      },
      draw: {
        name: "X",
        back: {
          odd: parseFloat(drawBack),
          liquidity: parseFloat(await moneyExchange(drawBackLiquidity)),
        },
        lay: {
          odd: parseFloat(drawLay),
          liquidity: parseFloat(await moneyExchange(drawLayLiquidity)),
        },
      },
    },
  };
};
const basketballScraping = async (match, search) => {
  // DATE AND LEAGUE
  const matchDate = await match.$eval(
    "h2 > div > span:nth-child(1)",
    (element) => element.textContent
  );

  const matchTime = await match.$eval(
    "h2 > div > span:nth-child(2)",
    (element) => element.textContent
  );

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME

  const gameLink = await match.$eval("h2 > a", (element) => element.href);

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "h2 > a > span > div:nth-child(1)",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match.$eval(
    "div > div:nth-child(1) > div > div > div:nth-child(1) > div > span:nth-child(1)",
    (element) => element.textContent
  );
  const team1BackLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // LAY

  const team1Lay = await match.$eval(
    "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(1)",
    (element) => element.textContent
  );
  const team1LayLiquidity = await match
    .$eval(
      "div > div:nth-child(1) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  let team2Name = await match.$eval(
    "h2 > a > span > div:nth-child(2)",
    (element) => element.textContent
  );

  team2Name = team2Name.replace("  at  ", "");

  // // BACK
  const team2Back = await match.$eval(
    "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(1)",
    (element) => element.textContent
  );
  const team2BackLiquidity = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(1) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // LAY
  const team2Lay = await match.$eval(
    "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(1)",
    (element) => element.textContent
  );
  const team2LayLiquidity = await match
    .$eval(
      "div > div:nth-child(2) > div > div > div:nth-child(2) > div > span:nth-child(2)",
      (element) => element.textContent
    )
    .catch(() => 0);

  const team1NameFormatted = nameFormatter(team1Name);
  const team2NameFormatted = nameFormatter(team2Name);

  const gameName = `${team1NameFormatted}-vs-${team2NameFormatted}`;

  const unifiedNameTeam1 = unifiedNameFinder(
    search.sport.toLowerCase(),
    search.country.toLowerCase(),
    team1NameFormatted
  );
  const unifiedNameTeam2 = unifiedNameFinder(
    search.sport.toLowerCase(),
    search.country.toLowerCase(),
    team2NameFormatted
  );

  const unifiedGameName = `${unifiedNameTeam1}-vs-${unifiedNameTeam2}`;

  return {
    league: search.league,
    game: gameName,
    unifiedGameName,
    link: gameLink,
    date: "",
    bookmaker: search.bookmaker,
    match: {
      team1: {
        name: team1Name,
        back: {
          odd: parseFloat(team1Back),
          liquidity: parseFloat(await moneyExchange(team1BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team1Lay),
          liquidity: parseFloat(await moneyExchange(team1LayLiquidity)),
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
          liquidity: parseFloat(await moneyExchange(team2BackLiquidity)),
        },
        lay: {
          odd: parseFloat(team2Lay),
          liquidity: parseFloat(await moneyExchange(team2LayLiquidity)),
        },
      },
    },
  };
};
