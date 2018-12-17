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
    name: faker.random.word(),
    planted: new Date(),
    waterEvery: faker.random.number(),
    lastWatered: new Date(),
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
      .get('/api/my-pets/' + _username)
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
      let resAdoptr;
      return chai.request(app)
        .get('/api/my-pets/' + _username)
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(pet) {
            expect(pet).to.be.a('object');
            expect(pet).to.include.keys(
              'username', 'id', 'name', 'waterEvery', 'lastWatered', 'planted', 'nextWater');
          });
          resAdoptr = res.body[0];
          return Adoptr.findById(resAdoptr.id);
        })
        .then(function(pet) {
          expect(resAdoptr.id).to.equal(pet.id);
          expect(resAdoptr.username).to.equal(pet.username);
          expect(resAdoptr.name).to.equal(pet.name);
          expect(resAdoptr.waterEvery).to.equal(pet.waterEvery);
          expect(resAdoptr.lastWatered).to.equal(pet.lastWatered.toDateString());
          expect(resAdoptr.planted).to.equal(pet.planted.toDateString());
          expect(resAdoptr.nextWater).to.equal(pet.nextWater.toDateString());
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new record', function() {
      const newPet = generateAdoptrData();
      return chai.request(app)
        .post('/api/my-pets/')
        .set('Authorization', `Bearer ${token}`)
        .send(newPet)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'username', 'name', 'planted', 'waterEvery', 'lastWatered', 'nextWater');
          return Adoptr.findById(res.body.id);
        })
        .then(function(pet) {
          expect(pet.id).to.not.be.null;
          expect(pet.username).to.equal(newPet.username);
          expect(pet.name).to.equal(newPet.name);
          expect(pet.waterEvery).to.equal(newPet.waterEvery);
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
        .then(function(pet) {
          updateData.id = pet.id;
          return chai.request(app)
          .put(`/api/my-pets/${pet.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);
        })
        .then(function(res) {
          expect (res).to.have.status(204);
          return Adoptr.findById(updateData.id);
        })
        .then(function(pet) {
          expect(pet.waterEvery).to.equal(updateData.waterEvery);
          expect(pet.lastWatered.toDateString()).to.equal(updateData.lastWatered.toDateString());
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('should delete a record by id', function() {
      let pet;
      return Adoptr
        .findOne()
        .then(function(_pet) {
          pet = _pet;
          return chai.request(app)
            .delete(`/api/my-pets/${pet.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Adoptr.findById(pet.id);
        })
        .then(function(_pet) {
          expect(_pet).to.be.null;
        });
    });
  });
});
