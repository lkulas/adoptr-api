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
  const animalOptions = ['dog', 'cat'];
  const ageOptions = ['puppyOrKitten', 'young', 'adult', 'senior'];
  const sizeOptions = ['small', 'medium', 'large', 'extraLarge'];
  const sexOptions = ['female', 'male'];
  let adoptrData = {
    username: _username,
    animal: animalOptions[Math.floor(Math.random() * animalOptions.length)],
    name: faker.name.firstName(),
    age: ageOptions[Math.floor(Math.random() * ageOptions.length)],
    size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)],
    animalId: faker.random.number().toString(),
    breed: faker.random.word(),
    sex: sexOptions[Math.floor(Math.random() * sexOptions.length)],
    altered: faker.random.boolean(),
    hasShots: faker.random.boolean(),
    housetrained: faker.random.boolean(),
    goodWith: {
      dogs: faker.random.boolean(),
      cats: faker.random.boolean(),
      children: faker.random.boolean(),
    },
    contact: {
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      address1: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zip: faker.address.zipCode()
    },
    photo: faker.image.imageUrl(),
    description: faker.lorem.paragraph()
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
      let resAdoptr;
      return chai.request(app)
        .get('/api/adoptr/' + _username)
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(adoptr) {
            expect(adoptr).to.be.a('object');
            expect(adoptr).to.include.keys(
              'id', 
              'username',
              'animal',
              'name',
              'age',
              'size',
              'animalId',
              'breed',
              'sex',
              'altered',
              'hasShots',
              'phone',
              'email',
              'address1',
              'city',
              'state',
              'zip',
              'housetrained',
              'cats',
              'children',
              'dogs',
              'photo',
              'description'
            );
          });
          resAdoptr = res.body[0];
          return Adoptr.findById(resAdoptr.id);
        })
        .then(function(adoptr) {
          expect(resAdoptr.id).to.equal(adoptr.id);
          expect(resAdoptr.username).to.equal(adoptr.username);
          expect(resAdoptr.animal).to.equal(adoptr.animal);
          expect(resAdoptr.name).to.equal(adoptr.name);
          expect(resAdoptr.age).to.equal(adoptr.age);
          expect(resAdoptr.size).to.equal(adoptr.size);
          expect(resAdoptr.animalId).to.equal(adoptr.animalId);
          expect(resAdoptr.breed).to.equal(adoptr.breed);
          expect(resAdoptr.sex).to.equal(adoptr.sex);
          expect(resAdoptr.altered).to.equal(adoptr.altered);
          expect(resAdoptr.hasShots).to.equal(adoptr.hasShots);
          expect(resAdoptr.housetrained).to.equal(adoptr.housetrained);
          expect(resAdoptr.photo).to.equal(adoptr.photo);
          expect(resAdoptr.description).to.equal(adoptr.description);
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new record', function() {
      const newAdoptr = generateAdoptrData();
      return chai.request(app)
        .post('/api/adoptr/')
        .set('Authorization', `Bearer ${token}`)
        .send(newAdoptr)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id',  
            'animal', 
            'name', 
            'age', 
            'size', 
            'animalId',
            'breed',
            'sex',
            'altered',
            'hasShots',
            'housetrained',
            'phone',
            'email',
            'address1',
            'city',
            'state',
            'zip',
            'photo',
            'description',
            'cats',
            'children',
            'dogs'
          );
          return Adoptr.findById(res.body.id);
        })
        .then(function(adoptr) {
          expect(adoptr.id).to.not.be.null;
          expect(adoptr.username).to.equal(newAdoptr.username);
          expect(adoptr.animal).to.equal(newAdoptr.animal);
          expect(adoptr.name).to.equal(newAdoptr.name);
          expect(adoptr.age).to.equal(newAdoptr.age);
          expect(adoptr.size).to.equal(newAdoptr.size);
          expect(adoptr.animalId).to.equal(newAdoptr.animalId);
          expect(adoptr.breed).to.equal(newAdoptr.breed);
          expect(adoptr.sex).to.equal(newAdoptr.sex);
          expect(adoptr.altered).to.equal(newAdoptr.altered);
          expect(adoptr.hasShots).to.equal(newAdoptr.hasShots);
          expect(adoptr.housetrained).to.equal(newAdoptr.housetrained);
          expect(adoptr.cats).to.equal(newAdoptr.cats);
          expect(adoptr.children).to.equal(newAdoptr.children);
          expect(adoptr.dogs).to.equal(newAdoptr.dogs);
          expect(adoptr.phone).to.equal(newAdoptr.phone);
          expect(adoptr.email).to.equal(newAdoptr.email);
          expect(adoptr.address1).to.equal(newAdoptr.address1);
          expect(adoptr.city).to.equal(newAdoptr.city);
          expect(adoptr.state).to.equal(newAdoptr.state);
          expect(adoptr.zip).to.equal(newAdoptr.zip);
          expect(adoptr.photo).to.equal(newAdoptr.photo);
          expect(adoptr.description).to.equal(newAdoptr.description);
        });
    });
  });

  describe('DELETE endpoint', function() {
    it('should delete a record by id', function() {
      let adoptr;
      return Adoptr
        .findOne()
        .then(function(_adoptr) {
          adoptr = _adoptr;
          return chai.request(app)
            .delete(`/api/adoptr/${adoptr.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Adoptr.findById(adoptr.id);
        })
        .then(function(_adoptr) {
          expect(_adoptr).to.be.null;
        });
    });
  });
});
