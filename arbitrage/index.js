import { CONFIG } from "../lib/constants.js";

export const arbitrage3Way = async (...bookmakers) => {
  const flattenArray = bookmakers.flat();

  const matches = bookmakers[0].map((match) => {
    const matchName = match.unifiedGameName;
    return flattenArray.filter((item) => {
      if (item.unifiedGameName === matchName) return item;
    });
  });

  // console.log(JSON.stringify(matches, null, 2));

  const newMatches = matches.map((match) => {
    return match.reduce(
      (acc, item) => {
        
        if (item.match.team1.back.odd > acc.odds.team1.selectedOdd) {
          acc.odds.team1.selectedOdd = item.match.team1.back.odd;
          acc.odds.team1.name = item.match.team1.name;

          const team1SelectedBookmaker = match.find(element => {
            return element.unifiedGameName === item.unifiedGameName && element.match.team1.back.odd === acc.odds.team1.selectedOdd
          });
          
          acc.odds.team1.bookmaker = team1SelectedBookmaker ? team1SelectedBookmaker.bookmaker : "";
        }

        if (item.match.draw.back.odd > acc.odds.draw.selectedOdd) {
          acc.odds.draw.selectedOdd = item.match.draw.back.odd;
          acc.odds.draw.name = item.match.draw.name;

          const drawSelectedBookmaker = match.find(element => {
            return element.game === item.game && element.match.draw.back.odd === acc.odds.draw.selectedOdd
          });

          acc.odds.draw.bookmaker = drawSelectedBookmaker ? drawSelectedBookmaker.bookmaker : "";
        }

        if (item.match.team2.back.odd > acc.odds.team2.selectedOdd) {
          acc.odds.team2.selectedOdd = item.match.team2.back.odd;
          acc.odds.team2.name = item.match.team2.name;
          
          const team2SelectedBookmaker = match.find(element => {
            return element.game === item.game && element.match.team2.back.odd === acc.odds.team2.selectedOdd
          });

          acc.odds.team2.bookmaker = team2SelectedBookmaker ? team2SelectedBookmaker.bookmaker : "";
        }

        acc.game = item.unifiedGameName;
        (acc.league = item.league),
          (acc.arbitrage =
            (1 / acc.odds.team1.selectedOdd + 1 / acc.odds.draw.selectedOdd + 1 / acc.odds.team2.selectedOdd) *
            100);

        acc.surebet = {
          check: acc.arbitrage < 100 ? true : false,
          margin: acc.arbitrage < 100 ? 100 - acc.arbitrage : 0,
        };

        return acc;
      },
      {
        arbitrage: 0,
        surebet: {},
        league: "",
        odds: {
          team1: {
            name: "",
            selectedOdd: 0,
            bookmaker: ""
          },
          draw: {
            name: "",
            selectedOdd: 0,
            bookmaker: ""
          },
          team2: {
            name: "",
            selectedOdd: 0,
            bookmaker: ""
          },
        },
      }
    );
  });

  if (CONFIG.showOnlySurebet === true) return newMatches.filter(match => match.surebet.check === true);
  else return newMatches;
};

export const arbitrage2Way = async (...bookmakers) => {
  const flattenArray = bookmakers.flat();

  const matches = bookmakers[0].map((match) => {
    const matchName = match.unifiedGameName;
    return flattenArray.filter((item) => {
      if (item.unifiedGameName === matchName) return item;
    });
  });

  // console.log(JSON.stringify(matches, null, 2));

  // console.log(matches);

  const newMatches = matches.map((match) => {
    return match.reduce(
      (acc, item) => {
        if (item.match.team1.back.odd > acc.odds.team1.selectedOdd) {
          acc.odds.team1.selectedOdd = item.match.team1.back.odd;
          acc.odds.team1.name = item.match.team1.name;

          const team1SelectedBookmaker = match.find(element => {
            return element.unifiedGameName === item.unifiedGameName && element.match.team1.back.odd === acc.odds.team1.selectedOdd
          });
          
          acc.odds.team1.bookmaker = team1SelectedBookmaker ? team1SelectedBookmaker.bookmaker : "";
        }

        if (item.match.team2.back.odd > acc.odds.team2.selectedOdd) {
          acc.odds.team2.selectedOdd = item.match.team2.back.odd;
          acc.odds.team2.name = item.match.team2.name;
          
          const team2SelectedBookmaker = match.find(element => {
            return element.game === item.game && element.match.team2.back.odd === acc.odds.team2.selectedOdd
          });

          acc.odds.team2.bookmaker = team2SelectedBookmaker ? team2SelectedBookmaker.bookmaker : "";
        }

        acc.game = item.unifiedGameName;
        (acc.league = item.league),
          (acc.arbitrage = (1 / acc.odds.team1 + 1 / acc.odds.team2) * 100);
        acc.surebet = {
          check: acc.arbitrage < 100 ? true : false,
          margin: acc.arbitrage < 100 ? 100 - acc.arbitrage : 0,
        };
        
        return acc;
      },
      {
        arbitrage: 0,
        surebet: {},
        league: "",
        odds: {
          team1: {
            name: "",
            selectedOdd: 0,
            bookmaker: ""
          },
          team2: {
            name: "",
            selectedOdd: 0,
            bookmaker: ""
          },
        },
      }
    );
  });

  if (CONFIG.showOnlySurebet === true) return newMatches.filter(match => match.surebet.check === true);
  else return newMatches;
};
