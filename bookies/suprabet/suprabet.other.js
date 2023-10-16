import { nameFormatter } from "../../utils/index.js";
import { CONFIG, BOOKIES, MARKET } from "../../lib/constants.js";
import {
  unifiedNameFinder,
  unifiedLeaguesFinder,
  unifiedSportsFinder,
} from "../../lib/unified/index.js";

// SUPRABET
export const suprabetOthers = async (search = {}, instanceNavigator) => {
  const browser = await instanceNavigator;
  const bookieSearch = Object.assign({}, search);
  const country = bookieSearch.country;
  const bookmaker = BOOKIES.SUPRABET;
  const market = bookieSearch.market;
  const sport = unifiedSportsFinder(bookmaker, bookieSearch.sport);
  const league = unifiedLeaguesFinder(bookmaker, country, bookieSearch.league);
  bookieSearch.bookmaker = bookmaker;
  let searchList;

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(CONFIG.pageTimeout);
  let url = "";

  try {
    if (!league) return [];
    if (bookieSearch.sport === "basketball")
      url = `https://www.suprabets.com/es/classic-sports#/${sport}/${league}`;
    else
      url = `https://www.suprabets.com/es/classic-sports#/${sport}/${country}/${league}`;

    await page.goto(url);

    // Check if the data was loaded, check the banner
    await page.waitForSelector("html div.events-list-container");

    // Waiting time in order to load all the data
    await page.waitForTimeout(CONFIG.timeout);

    await marketSelection(page, bookieSearch.market, bookieSearch.sport);

    const matchesList = await page.$$(
      "div#eventListBody div.sbEventsList__event-block-layout2 > div.ember-view > div.sbEventsList__event-info-layout2"
    );

    // MARKET SELECTION

    searchList = await Promise.all(
      matchesList.map(async (match) => {
        if (bookieSearch.sport.toLowerCase() === "soccer")
          return soccerScraping(match, bookieSearch);
        if (bookieSearch.sport.toLowerCase() === "basketball")
          return basketballScraping(match, bookieSearch);
      })
    );

    await page.screenshot({ path: `${bookmaker}`.png });
    return searchList;
  } catch (e) {
    console.log(e);
  } finally {
    await page.close();
  }
};

const soccerScraping = async (match, search) => {
  // DATE AND LEAGUE

  // const matchDate = await match.$eval("", element => element.textContent);

  // const matchTime = await match.$eval(
  //   "div.sbEventsList__time",
  //   (element) => element.textContent
  // );

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME

  // const gameLink = await match.$eval("h2 > a", element => element.href);

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "div:nth-child(1) > div > div:nth-child(1) > div.team-name-layout2",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div:nth-child(2) > div:nth-child(1) > div.sb-game-bet-coeficiente",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  const team2Name = await match.$eval(
    "div:nth-child(1) > div > div:nth-child(2) > div.team-name-layout2",
    (element) => element.textContent
  );

  // // BACK
  const team2Back = await match
    .$eval(
      "div:nth-child(2) > div:nth-child(3) > div.sb-game-bet-coeficiente",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // DRAW

  // // BACK
  const drawBack = await match
    .$eval(
      "div:nth-child(2) > div:nth-child(2) > div.sb-game-bet-coeficiente",
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
    link: "gameLink",
    date: "",
    bookmaker: search.bookmaker,
    match: {
      team1: {
        name: team1Name,
        back: {
          odd: parseFloat(team1Back),
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
        },
      },
      draw: {
        name: "X",
        back: {
          odd: parseFloat(drawBack),
        },
      },
    },
  };
};

const soccerScrapingTotals = async (match, search) => {
  // TEAM1
  const team1Name = await match.$eval(
    "div:nth-child(1) > div > div:nth-child(1) > div.team-name-layout2",
    (element) => element.textContent
  );


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
    game: gameName,
    unifiedGameName,
    markets: {
      overUnder: [
        {
          base,
          over,
          under,
        },
      ],
    },
  };
};

const basketballScraping = async (match, search) => {
  // DATE AND LEAGUE

  // const matchDate = await match.$eval("", element => element.textContent);

  // const matchTime = await match.$eval("div > div > div > div > div > div.sbEventsList__time", element => element.textContent);
  // const matchTime = await match.$eval(
  //   "div.sbEventsList__time",
  //   (element) => element.textContent
  // );

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME

  // const gameLink = await match.$eval("h2 > a", element => element.href);

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "div:nth-child(1) > div:nth-child(1) > div:nth-child(1) div.team-name-layout2",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div:nth-child(2) > div:nth-child(1) > div.sb-game-bet-coeficiente",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  const team2Name = await match.$eval(
    "div:nth-child(1) > div > div:nth-child(2) > div.team-name-layout2",
    (element) => element.textContent
  );

  // // BACK
  const team2Back = await match
    .$eval(
      "div:nth-child(2) > div:nth-child(2) > div.sb-game-bet-coeficiente",
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
    link: "gameLink",
    date: "",
    bookmaker: search.bookmaker,
    match: {
      team1: {
        name: team1Name,
        back: {
          odd: parseFloat(team1Back),
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
        },
      },
    },
  };
};

const marketSelection = async (page, market, sport) => {
  if (sport === "soccer") {
    switch (market) {
      case MARKET.overUnder:
        await page.click("div.sb-custom-select-header");
        await page.waitForTimeout(300);
        await page.click(
          "ul.sb-custom-select-options > li.sbEventsList__options-li:nth-child(6)"
        );
        break;
      default:
        break;
    }
  } else if (sport === "basketball") {
  } else {
  }
};
