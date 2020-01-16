import {matchbook} from "./bookies";

const search = {
  country: 'italy',
  league: 'serie-a-tim'
};

matchbook(search).then((value) => {
  console.log(JSON.stringify(value, null, 4));
});