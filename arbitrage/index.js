export const arbitrage3Way = async (...bookmakers) => {
  const flattenArray = bookmakers.flat();

  const matches = bookmakers[0].map((match) => {
    const matchName = match.unifiedGameName;
    return flattenArray.filter((item) => {
      if (item.unifiedGameName === matchName) return item;
    });
  });

  console.log(JSON.stringify(matches, null, 2));

  const newMatches = matches.map((match) => {
    return match.reduce(
      (acc, item) => {
        if (item.match.team1.back.odd > acc.odds.team1) {
          acc.odds.team1 = item.match.team1.back.odd;
        }

        if (item.match.draw.back.odd > acc.odds.draw) {
          acc.odds.draw = item.match.draw.back.odd;
        }

        if (item.match.team2.back.odd > acc.odds.team2) {
          acc.odds.team2 = item.match.team2.back.odd;
        }

        acc.game = item.unifiedGameName;
        (acc.league = item.league),
          (acc.arbitrage =
            (1 / acc.odds.team1 + 1 / acc.odds.draw + 1 / acc.odds.team2) *
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
          team1: 0,
          draw: 0,
          team2: 0,
        },
      }
    );
  });

  return newMatches;
};

export const arbitrage2Way = async (...bookmakers) => {
  const flattenArray = bookmakers.flat();

  const matches = bookmakers[0].map((match) => {
    const matchName = match.unifiedGameName;
    return flattenArray.filter((item) => {
      if (item.unifiedGameName === matchName) return item;
    });
  });

  console.log(JSON.stringify(matches, null, 2));

  // console.log(matches);

  const newMatches = matches.map((match) => {
    return match.reduce(
      (acc, item) => {
        if (item.match.team1.back.odd > acc.odds.team1) {
          acc.odds.team1 = item.match.team1.back.odd;
        }

        if (item.match.team2.back.odd > acc.odds.team2) {
          acc.odds.team2 = item.match.team2.back.odd;
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
          team1: 0,
          team2: 0,
        },
      }
    );
  });

  return newMatches;
};
