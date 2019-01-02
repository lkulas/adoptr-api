'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AdoptrSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  animal: {
    type: String
  },
  name: {
    type: String
  },
  age: {
    type: String
  },
  size: {
    type: String
  },
  breed: {
    type: String
  },
  sex: {
    type: String
  },
  contact: {
    phone: {
      type: String
    },
    email: {
      type: String
    },
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    },
  },
  photo: {
    type: String
  },
  description: {
    type: String
  }
});

AdoptrSchema.methods.serialize = function() {
  return {
    username: this.username,
    id: this._id,
    animal: this.animal,
    name: this.name,
    age: this.age,
    size: this.size,
    animalId: this.animalId,
    breed: this.breed,
    sex: this.sex,
    phone: this.contact.phone,
    email: this.contact.email,
    address1: this.contact.address1,
    address2: this.contact.address2,
    city: this.contact.city,
    state: this.contact.state,
    zip: this.contact.zip,
    photo: this.photo,
    description: this.description
  };
};

const Adoptr = mongoose.model('Adoptr', AdoptrSchema);

module.exports = {Adoptr};
