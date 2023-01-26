import { extractDate, nameFormatter } from "../utils/index.js";
import { CONFIG, BOOKIES } from "../lib/constants.js";
import {
  unifiedNameFinder,
  unifiedLeaguesFinder,
  unifiedSportsFinder,
} from "../lib/unified/index.js";

// MARATHONBET
export const marathonbet = async (search = {}, instanceNavigator) => {
  const browser = await instanceNavigator;
  const bookieSearch = Object.assign({}, search);
  const country = bookieSearch.country;
  const bookmaker = BOOKIES.MARATHON;
  const sport = unifiedSportsFinder(bookmaker, bookieSearch.sport);
  const league = unifiedLeaguesFinder(bookmaker, country, bookieSearch.league);
  bookieSearch.bookmaker = bookmaker;
  let searchList;

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(CONFIG.pageTimeout);

  try {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto(
      `https://www.marathonbet.com/es/betting/${sport}/${country}/${league}`
    );

    // Check if the data was loaded
    await page.waitForSelector(
      "div.bg:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2)"
    );

    // Waiting time in order to load all the data
    await page.waitForTimeout(CONFIG.timeout);

    const matchesList = await page.$$("div.coupon-row");

    searchList = await Promise.all(
      matchesList.map(async (match) => {
        if (bookieSearch.sport.toLowerCase() === "soccer")
          return soccerScraping(match, bookieSearch);
        if (bookieSearch.sport.toLowerCase() === "basketball")
          return basketBallScraping(match, bookieSearch);
      })
    );

    await page.screenshot({ path: "marathon.png" });
    return searchList;
  } catch (e) {
    console.log(e);
  } finally {
    await page.close();
  }
};

const soccerScraping = async (match, search) => {
  // DATE AND LEAGUE
  // const headerTag = await match.$eval("div:nth-child(1) > div > span.EventHeader__start___2Xn2h", element => element.textContent);
  // const headerSplit = headerTag.split('|');

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);
  // const league = headerSplit[1].trim() || '';

  // GAME
  // const gameName = await match.$eval("div:nth-child(1) > div > a > h1", element => element.textContent);
  const gameLink = await match.$eval(
    "table tbody div a.member-link",
    (element) => element.href
  );

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "table tbody tr:nth-child(1) div a.member-link span",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match.$eval(
    "table tbody td:nth-child(3) span",
    (element) => element.textContent
  );

  // TEAM2
  const team2Name = await match.$eval(
    "table tbody tr:nth-child(2) div a.member-link span",
    (element) => element.textContent
  );

  // BACK
  const team2Back = await match.$eval(
    "table tbody td:nth-child(5) span",
    (element) => element.textContent
  );

  // BACK
  const drawBack = await match.$eval(
    "table tbody td:nth-child(4) span",
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
        },
      },
      team2: {
        name: team2Name,
        back: {
          odd: parseFloat(team2Back),
        },
      },
      draw: {
        name: "draw",
        back: {
          odd: parseFloat(drawBack),
        },
      },
    },
  };
};

const basketBallScraping = async (match, search) => {
  // DATE AND LEAGUE
  // const headerTag = await match.$eval("div:nth-child(1) > div > span.EventHeader__start___2Xn2h", element => element.textContent);
  // const headerSplit = headerTag.split('|');

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);
  // const league = headerSplit[1].trim() || '';

  // GAME
  // const gameName = await match.$eval("div:nth-child(1) > div > a > h1", element => element.textContent);
  const gameLink = await match.$eval(
    "table tbody div a.member-link",
    (element) => element.href
  );

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "table tbody tr:nth-child(1) div a.member-link span",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match.$eval(
    "table tbody td:nth-child(3) span",
    (element) => element.textContent
  );

  // TEAM2
  const team2Name = await match.$eval(
    "table tbody tr:nth-child(2) div a.member-link span",
    (element) => element.textContent
  );

  // BACK
  const team2Back = await match.$eval(
    "table tbody td:nth-child(4) span",
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
