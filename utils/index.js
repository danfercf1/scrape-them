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
  let hour, month, day, year;
  switch (bookie) {
    case BOOKIES.MATCHBOOK:
      hour = date.slice(-5);
      day = date.slice(4, 6);
      month = date.slice(0, 3);
      newDate = new Date(`${day} ${month} ${hour}`);
    break;
    case BOOKIES.GENIOBET:
      day = date.slice(0, 2);
      month = date.slice(3, 5);
      year = date.slice(-2);
      console.log(day, month);
      newDate = new Date(`${day} ${month} 00:00:00.006Z`);
    break;
    default: newDate = date;
  }
  return newDate;
};
