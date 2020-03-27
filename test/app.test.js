const supertest = require('supertest');
const app = require('../app')
const { expect } = require('chai')

// SUPERTEST CAN ALSO TEST POST / PUT/ & DELETE ENDPOINTS
// READ THE DOCUMENTATION
// LATER NODE LESSONS WILL ALSO EXPLAIN HOW

describe('GET /apps', () => {
    // Did we get a 200 status back?
    // Is the content-type header JSON?
    it('should return an array of apps', () => {
      return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        //is the returned data an array?
        .then(res => {
            expect(res.body).to.be.an('array')
            //does the array contain book objects?
            expect(res.body).to.have.lengthOf.at.least(1)
            //does the book object have the correct shape?
            const app = res.body[0]
            expect(app).to.include.all.keys(
               'App', 'Rating', 'Installs', 'Genres'
            )
        })
    })

    //does the program return 400 if sort is not title or rating?
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'MISTAKE' })
          .expect(400, 'Sort must be one of app or rating');
      });

    // does the program filter by genre?
    it('should filter by genre', () => {
      return supertest(app)
      .get('/apps')
      .query({ genres: 'card' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body[0].genres).to.equal("Card");
    })
  })


    //we can't automatically check if an array is sorted.
    //instead, we have to iterate the array and check ourselves.
    //keep the test simple, but sometimes you have to add some logic
    // ------------SORTING WORKS--------------//
    it('should sort by app', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'app' })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
    
            let i = 0;
            // iterate once less than the length of the array
            // because we're comparing 2 items in the array at a time
            while (i < res.body.length - 1) {
              // compare app at `i` with next app at `i + 1`
              const appAtI = res.body[i];
              const appAtIPlus1 = res.body[i + 1];
              // if the next app is less than the app at i,
              if (appAtIPlus1.App < appAtI.App) {
                // the apps were not sorted correctly
                sorted = false;
                break; // exit the loop
              }
              i++;
            }
            expect(sorted).to.be.true;
          });
      });

    

      // write sort by rating
      //write sort by genre

  })

