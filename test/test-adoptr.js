'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { Adoptr } = require('../adoptr');
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

function seedAdoptrData() {
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateAdoptrData());
  }
  return Adoptr.insertMany(seedData);
}

function generateAdoptrData() {
  let adoptrData = {
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
    },
    savedMatches: [{
      animal: 'Dog',
      name: faker.name.firstName(),
      age: 'Adult',
      size: 'Small',
      animalId: faker.random.number().toString(),
      breed: 'Corgi',
      sex: 'Male',
      altered: true,
      hasShots: true,
      housetrained: false,
      contact: {
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        address1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode()
      },
      photo: faker.image.animals(),
      description: faker.lorem.paragraph(),
      goodWith: {
        children: true,
        dogs: true,
        cats: false
      }
    }]
  };
  return adoptrData;
}

function tearDownDb() {
  return mongoose.connection.dropDatabase();
}

describe('Adoptr API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return seedAdoptrData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  describe('GET endpoint', function() {
    it('should return existing records for logged in user', function() {
      let res;
      return chai.request(app)
      .get('/api/adoptr/' + _username)
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf.at.least(1);
        return Adoptr
          .find({ username: _username })
          .count();
      })
      .then(function(count) {
        expect(res.body).to.have.lengthOf(count);
      });
    });

    it('should return records with correct fields', function() {
      let resGarden;
      return chai.request(app)
        .get('/api/adoptr/' + _username)
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(garden) {
            expect(garden).to.be.a('object');
            expect(garden).to.include.keys(
              'username', 'id', 'name', 'waterEvery', 'lastWatered', 'planted', 'nextWater');
          });
          resGarden = res.body[0];
          return Adoptr.findById(resGarden.id);
        })
        .then(function(garden) {
          expect(resGarden.id).to.equal(garden.id);
          expect(resGarden.username).to.equal(garden.username);
          expect(resGarden.name).to.equal(garden.name);
          expect(resGarden.waterEvery).to.equal(garden.waterEvery);
          expect(resGarden.lastWatered).to.equal(garden.lastWatered.toDateString());
          expect(resGarden.planted).to.equal(garden.planted.toDateString());
          expect(resGarden.nextWater).to.equal(garden.nextWater.toDateString());
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new record', function() {
      const newPlant = generateAdoptrData();
      return chai.request(app)
        .post('/api/adoptr/')
        .set('Authorization', `Bearer ${token}`)
        .send(newPlant)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'username', 'name', 'planted', 'waterEvery', 'lastWatered', 'nextWater');
          return Adoptr.findById(res.body.id);
        })
        .then(function(garden) {
          expect(garden.id).to.not.be.null;
          expect(garden.username).to.equal(newPlant.username);
          expect(garden.name).to.equal(newPlant.name);
          expect(garden.waterEvery).to.equal(newPlant.waterEvery);
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update a record with new fields', function() {
      const updateData = {
        waterEvery: 7,
        lastWatered: new Date("2018-09-30")
      };
      return Adoptr
        .findOne()
        .then(function(garden) {
          updateData.id = garden.id;
          return chai.request(app)
          .put(`/api/adoptr/${garden.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);
        })
        .then(function(res) {
          expect (res).to.have.status(204);
          return Adoptr.findById(updateData.id);
        })
        .then(function(garden) {
          expect(garden.waterEvery).to.equal(updateData.waterEvery);
          expect(garden.lastWatered.toDateString()).to.equal(updateData.lastWatered.toDateString());
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('should delete a record by id', function() {
      let garden;
      return Adoptr
        .findOne()
        .then(function(_garden) {
          garden = _garden;
          return chai.request(app)
            .delete(`/api/adoptr/${garden.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Adoptr.findById(garden.id);
        })
        .then(function(_garden) {
          expect(_garden).to.be.null;
        });
    });
  });
});
