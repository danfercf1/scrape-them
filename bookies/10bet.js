import { extractDate, nameFormatter, debugElementHandler } from "../utils/index.js";
import { CONFIG, BOOKIES } from "../lib/constants.js";
import {
  unifiedNameFinder,
  unifiedLeaguesFinder,
  unifiedSportsFinder,
} from "../lib/unified/index.js";

// 10BET
export const tenbet = async (search = {}, instanceNavigator) => {
  const browser = await instanceNavigator;
  const bookieSearch = Object.assign({}, search);
  const country = bookieSearch.country;
  const bookmaker = BOOKIES.TENBET;
  const sport = unifiedSportsFinder(bookmaker, bookieSearch.sport);
  const league = unifiedLeaguesFinder(bookmaker, country, bookieSearch.league);
  bookieSearch.bookmaker = bookmaker;
  let searchList;

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(CONFIG.pageTimeout);

  try {
    await page.goto(`https://www.10bet.com/sports/${sport}/${league}`);

    // Check if the data was loaded, check the banner
    await page.waitForSelector(
      "sb-comp > div:nth-child(1) > div > sb-lazy-render > div > div"
    );

    // Waiting time in order to load all the data
    await page.waitForTimeout(CONFIG.timeout);

    const matchesList = await page.$$("div.rj-ev-list__ev-card");

    searchList = await Promise.all(
      matchesList.map(async (match) => {
        if (bookieSearch.sport.toLowerCase() === "soccer")
          return soccerScraping(match, bookieSearch);
        if (bookieSearch.sport.toLowerCase() === "basketball")
          return basketBallScraping(match, bookieSearch);
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

  // const matchDate = await match.$eval("", element => element.textContent);

  // const matchTime = await match.$eval("div.sbEventsList__time", element => element.textContent);

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // GAME
  const gameLink = await match.$eval(
    "div.rj-ev-list__ev-card__inner a:nth-child(1)",
    (element) => element.href
  );

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "div.rj-ev-list__ev-card__team-1-name span",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div.rj-ev-list__ev-card__section > button:nth-child(1) div:nth-child(2) > span",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  const team2Name = await match.$eval(
    "div.rj-ev-list__ev-card__team-2-name span",
    (element) => element.textContent
  );

  // // BACK
  const team2Back = await match
    .$eval(
      "div.rj-ev-list__ev-card__section > button:nth-child(3) div:nth-child(2) > span",
      (element) => element.textContent
    )
    .catch(() => 0);

  // // DRAW
  // // BACK
  const drawBack = await match
    .$eval(
      "div.rj-ev-list__ev-card__section > button:nth-child(2) div:nth-child(2) > span",
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

const basketBallScraping = async (match, search) => {
  // DATE AND LEAGUE

  const matchDate = await match.$eval("div.rj-ev-list__ev-card__date", element => element.textContent);

  const matchTime = await match.$eval("div.rj-ev-list__ev-card__time", element => element.textContent);

  // let date = headerSplit[0].trim() || '';
  // date = extractDate(date);

  // debugElementHandler(match);

  // GAME
  const gameLink = await match.$eval(
    "a.rj-ev-list__ev-card__event-info",
    (element) => element.href
  );

  // VS
  // TEAM1
  const team1Name = await match.$eval(
    "div.rj-ev-list__ev-card__team-1-name span",
    (element) => element.textContent
  );

  // BACK
  const team1Back = await match
    .$eval(
      "div.rj-ev-list__ev-card__section:nth-child(2) > button:nth-child(1) span.rj-ev-list__bet-btn__odd",
      (element) => element.textContent
    )
    .catch(() => 0);

  // TEAM2
  const team2Name = await match.$eval(
    "div.rj-ev-list__ev-card__team-2-name span",
    (element) => element.textContent
  );

  // // BACK
  const team2Back = await match
    .$eval(
      "div.rj-ev-list__ev-card__section:nth-child(2) > button:nth-child(2) span.rj-ev-list__bet-btn__odd",
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
    date: `${matchDate} - ${matchTime}`,
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
