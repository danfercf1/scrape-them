import { soccer } from "./soccer/index.js";
import { basketball } from "./basketball/index.js";

export const unifiedNameFinder = (sport, country, teamName) => {
  const unified = unifiedNames[`${sport}`][`${country}`].filter(
    (searchName) => {
      if (searchName.values.includes(teamName)) return searchName;
    }
  );

  if (unified.length > 0) return unified[0].name;
  else return teamName;
};

const unifiedNames = {
  soccer,
  basketball,
};

export const unifiedLeaguesFinder = (bookmaker, country, league) => {
  if (unifiedLeagues[`${bookmaker}`][`${country}`]) {
    return unifiedLeagues[`${bookmaker}`][`${country}`][`${league}`];
  } else {
    return false;
  }
};

const unifiedLeagues = {
  marathonbet: {
    england: {
      "premier-league": "Premier+League+-+21520",
      "league-1": "League+1+-+22808",
    },
    italy: {
      "serie-a": "Serie+A+-+22434",
    },
    spain: {
      "la-liga": "Primera+Division+-+8736",
      "segunda-division": "Segunda+Division+-+48300",
    },
    france: {
      "ligue-1": "Ligue+1+-+21533",
    },
    germany: {
      bundesliga: "Bundesliga+-+22436",
    },
    portugal: {
      "primera-liga": "Primeira+Liga+-+43058",
    },
    netherlands: {
      eredivisie: "Eredivisie+-+38090",
    },
    brazil: {
      paulista: "Paulista/Serie+A1+-+378964",
    },
    usa: {
      nba: "NBA+-+69367",
    },
  },
  suprabet: {
    england: {
      "premier-league": "538",
      "league-1": "1843",
    },
    italy: {
      "serie-a": "543",
    },
    spain: {
      "la-liga": "545",
      "segunda-division": "553",
    },
    france: {
      "ligue-1": "548",
    },
    germany: {
      bundesliga: "541",
    },
    portugal: {
      "primera-liga": "560",
    },
    netherlands: {
      eredivisie: "1957",
    },
    brazil: {
      paulista: "1803",
    },
    usa: {
      nba: "North America/756",
    },
  },
  matchbook: {
    england: {
      "premier-league": "england-premier-league",
      // "league-2": "england-league-2",
    },
    italy: {
      "serie-a": "italy-serie-a",
    },
    spain: {
      "la-liga": "spain-la-liga",
    },
    france: {
      "ligue-1": "france-ligue-1",
    },
    germany: {
      bundesliga: "germany-bundesliga",
    },
    usa: {
      nba: "nba",
    },
  },
  tenbet: {
    england: {
      "premier-league": "england-premier-league",
    },
    italy: {
      "serie-a": "italy-serie-a",
    },
    spain: {
      "la-liga": "spain-la-liga",
    },
    france: {
      "ligue-1": "france-ligue-1",
    },
    germany: {
      bundesliga: "germany-1-bundesliga",
    },
    portugal: {
      "primera-liga": "portugal-primeira-liga",
    },
    netherlands: {
      eredivisie: "netherlands-eredivisie",
    },
    brazil: {
      paulista: "brazil-paulista",
    },
    usa: {
      nba: "nba",
    },
  },
};

export const unifiedSportsFinder = (bookmaker, sport) => {
  return unifiedSports[`${bookmaker}`][`${sport}`];
};

const unifiedSports = {
  marathonbet: {
    soccer: "Football",
    basketball: "Basketball",
  },
  matchbook: {
    soccer: "soccer",
    basketball: "basketball",
  },
  suprabet: {
    soccer: "Soccer",
    basketball: "Basketball",
  },
  tenbet: {
    soccer: "football",
    basketball: "basketball",
  },
};
