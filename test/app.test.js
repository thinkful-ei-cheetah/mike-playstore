const app = require('../src/app');
const playstore = require('../playstores')
const request = require('supertest');
const chai = require('chai');

const expect = chai.expect;

// 'describe' is a wrapper/ grouper
describe('GET /store endpoint', () => {
  it('should return all the data from playstore', () => {
    const expected = playstore;
    return request(app)
      .get('/store') // invoke the endpoint
      .expect(200, expected) // assert that you get a 200 OK status
      .expect('Content-Type', /json/);
  });

  it('should return 400 for incorrect sort filter', () => {
    return request(app)
      .get('/store')
      .query({sort: 'something'})
      .expect(400);
  })

  it('should return 200 with correctly sorted output by app', () => {
    return request(app)
      .get('/store')
      .query({sort: 'app'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;

        while (sorted && i < res.body.length - 1) {
          // console.log([res.body[i].App, res.body[i + 1].App])
          // console.log(res.body[i].App < res.body[i + 1].App);
          sorted = sorted && res.body[i].App.toLowerCase() < res.body[i + 1].App.toLowerCase();
          i++;
        }
        expect(sorted).to.be.true;
      });
  })

  it('should return 200 with correctly sorted output by rating', () => {
    return request(app)
      .get('/store')
      .query({sort: 'Rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;

        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  })

  const possibleGenres = [
    'Action', 
    'Puzzle', 
    'Strategy', 
    'Casual', 
    'Arcade', 
    'Card'
  ]

  possibleGenres.forEach(genre => {
    it('should return 200 with correctly filtered output by genre', () => {
      return request(app)
        .get('/store')
        .query({genres: genre})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          res.body.forEach(app => {
            expect(app.Genres).to.include(genre);
        });
      });
    });
  });
});
