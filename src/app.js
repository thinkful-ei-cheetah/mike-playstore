const express = require('express');
const morgan = require('morgan');
const playstores = require('../playstores');
const {capitalize} = require('./helper');
const app = express();

app.use(morgan('common'));

app.get('/store', (req, res) => {
  let {sort, genres} = req.query;
  let results = playstores;

  if (sort) {
    sort = capitalize(sort);
    if (!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be of App or Rating');
    }
    if (sort === 'Rating') {
      results.sort((a, b) => {
        return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
      });
    } else {
      results.sort((a, b) => {
        return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
      });
    }
  }
  
  if (genres) {
    genres = capitalize(genres);
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
    results = playstores.filter(item => {
      let regex = new RegExp(genres, 'i');
      return regex.test(item['Genres']);
    });
  }

  res.status(200).json(results);
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});