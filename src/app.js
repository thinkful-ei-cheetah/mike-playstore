const express = require('express');
const morgan = require('morgan');
const playstores = require('../playstores');
const {capitalize} = require('./helper');
const app = express();

app.use(morgan('common'));

// get pathing for req and res
app.get('/store', (req, res) => {
  let {sort, genres} = req.query;
  let results = playstores;

  if (sort) {
    // capitalize from helper file
    sort = capitalize(sort);
    // validating if rating and app is not included to throw msg
    if (!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be of App or Rating');
    }

    if (sort === 'Rating') {
      results.sort((a, b) => {
        // if 'a' is less than 'b' return '1'
        // if 'a' is greater than 'b' return '-1'
        // else return '0'
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
    } else {
      results.sort((a, b) => {
        // same case as above except it is set to lowercase
        return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
      });
    }
  }
  
  if (genres) {
    // capitalize from helper file
    genres = capitalize(genres);
    // validating if genres include the list below
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
    // filter thru using regex to return genres
    results = playstores.filter(item => {
      let regex = new RegExp(genres, 'i');
      return regex.test(item['Genres']);
    });
  }

  res.status(200).json(results);
});

// // hacky way to prevent server and test collision
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(3000, () => {
//     console.log('server running on port 3000');
//   });
// }

module.exports = app;