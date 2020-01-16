import {convertCurrency} from "currencies-exchange-rates";

import {BOOKIES} from "../lib/constants";;

const currencies = /(\d+([\.,]\d{2}?))|(\d+(|[\.,]\d{1,2}?))/;

export const moneyExchange = async (amount, from = 'GBP', to = 'USD') => {
  const re = new RegExp(currencies);
  const match = amount.match(re);
  const parsedAmount = parseFloat(match[0] || 0);
  return parseFloat(await convertCurrency(from, to, parsedAmount)).toFixed(2);
};

export const extractDate = (bookie = BOOKIES.MATCHBOOK, date = new Date()) => {
  let newDate;
  switch (bookie) {
    case BOOKIES.MATCHBOOK:
      const hour = date.slice(-5);
      const month = date.slice(0, 3);
      const day = date.slice(4, 6);
      newDate = new date(day + '' + month + '' + hour);
    break;
    default: newDate = date;
  }
  return newDate;
};
