'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { Preferences } = require('../preferences');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

const _username = 'exampleUser1';

const token = jwt.sign(
  {
    user: {
      _username
    }
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    subject: _username,
    expiresIn: '7d'
  }
);

chai.use(chaiHttp);

function seedPreferencesData() {
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generatePreferencesData());
  }
  return Preferences.insertMany(seedData);
}

function generatePreferencesData() {
  let preferencesData = {
    username: _username,
    animal: {
      dog: true,
      cat: false
    },
    age: {
      puppyOrKitten: true,
      young: true,
      adult: true,
      senior: false
    },
    size: {
      small: true,
      medium: true,
      large: false,
      extraLarge: false
    },
    gender: {
      male: true,
      female: true
    },
    goodWith: {
      children: false,
      dogs: true,
      cats: false
    },
    health: {
      altered: true,
      hasShots: true,
      housetrained: false
    }
  };
  return preferencesData;
}

function tearDownDb() {
  return mongoose.connection.dropDatabase();
}

describe('Preferences API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return seedPreferencesData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  describe('GET endpoint', function() {
    it('should return existing records for logged in user', function() {
      let res;
      return chai.request(app)
      .get('/api/preferences/' + _username)
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf.at.least(1);
        return Preferences
          .find({ username: _username })
          .count();
      })
      .then(function(count) {
        expect(res.body).to.have.lengthOf(count);
      });
    });

    it('should return records with correct fields', function() {
      let resPreferences;
      return chai.request(app)
        .get('/api/preferences/' + _username)
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(preferences) {
            expect(preferences).to.be.a('object');
            expect(preferences).to.include.keys(
              'username', 
              'id', 
              'animal',
              'age',
              'size',
              'gender',
              'goodWith',
              'health'
            );
          });
          resPreferences = res.body[0];
          return Preferences.findById(resPreferences.id);
        })
        .then(function(preferences) {
          expect(resPreferences.id).to.equal(preferences.id);
          expect(resPreferences.username).to.equal(preferences.username);
          expect(resPreferences.dog).to.equal(preferences.dog);
          expect(resPreferences.cat).to.equal(preferences.cat);
          expect(resPreferences.puppyOrKitten).to.equal(preferences.puppyOrKitten);
          expect(resPreferences.young).to.equal(preferences.young);
          expect(resPreferences.adult).to.equal(preferences.adult);
          expect(resPreferences.senior).to.equal(preferences.senior);
          expect(resPreferences.small).to.equal(preferences.small);
          expect(resPreferences.medium).to.equal(preferences.medium);
          expect(resPreferences.large).to.equal(preferences.large);
          expect(resPreferences.extraLarge).to.equal(preferences.extraLarge);
          expect(resPreferences.male).to.equal(preferences.male);
          expect(resPreferences.female).to.equal(preferences.female);
          expect(resPreferences.children).to.equal(preferences.children);
          expect(resPreferences.dogs).to.equal(preferences.dogs);
          expect(resPreferences.cats).to.equal(preferences.cats);
          expect(resPreferences.altered).to.equal(preferences.altered);
          expect(resPreferences.hasShots).to.equal(preferences.hasShots);
          expect(resPreferences.housetrained).to.equal(preferences.housetrained);
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new record', function() {
      const newPreferences = generatePreferencesData();
      return chai.request(app)
        .post('/api/preferences/')
        .set('Authorization', `Bearer ${token}`)
        .send(newPreferences)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 
            'username', 
            'animal', 
            'age', 
            'size', 
            'gender', 
            'goodWith',
            'health'
          );
          return Preferences.findById(res.body.id);
        })
        .then(function(preferences) {
          expect(preferences.id).to.not.be.null;
          expect(preferences.username).to.equal(newPreferences.username);
          expect(preferences.cat).to.equal(newPreferences.cat);
          expect(preferences.dog).to.equal(newPreferences.dog);
          expect(preferences.puppyOrKitten).to.equal(newPreferences.puppyOrKitten);
          expect(preferences.young).to.equal(newPreferences.young);
          expect(preferences.adult).to.equal(newPreferences.adult);
          expect(preferences.senior).to.equal(newPreferences.senior);
          expect(preferences.small).to.equal(newPreferences.small);
          expect(preferences.medium).to.equal(newPreferences.medium);
          expect(preferences.large).to.equal(newPreferences.large);
          expect(preferences.extraLarge).to.equal(newPreferences.extraLarge);
          expect(preferences.male).to.equal(newPreferences.male);
          expect(preferences.female).to.equal(newPreferences.female);
          expect(preferences.children).to.equal(newPreferences.children);
          expect(preferences.dogs).to.equal(newPreferences.dogs);
          expect(preferences.cats).to.equal(newPreferences.cats);
          expect(preferences.altered).to.equal(newPreferences.altered);
          expect(preferences.hasShots).to.equal(newPreferences.hasShots);
          expect(preferences.housetrained).to.equal(newPreferences.housetrained);
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update a record with new fields', function() {
      const updateData = {
        animal: {
          dog: false,
          cat: true
        },
        age: {
          puppyOrKitten: true,
          young: true,
          adult: true,
          senior: true
        }
      };
      return Preferences
        .findOne()
        .then(function(preferences) {
          updateData.id = preferences.id;
          return chai.request(app)
          .put(`/api/preferences/${preferences.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);
        })
        .then(function(res) {
          expect (res).to.have.status(204);
          return Preferences.findById(updateData.id);
        })
        .then(function(preferences) {
          expect(preferences.dog).to.equal(updateData.dog);
          expect(preferences.cat).to.equal(updateData.cat);
          expect(preferences.puppyOrKitten).to.equal(updateData.puppyOrKitten);
          expect(preferences.young).to.equal(updateData.young);
          expect(preferences.adult).to.equal(updateData.adult);
          expect(preferences.senior).to.equal(updateData.senior);
        });
    });
  });
});
