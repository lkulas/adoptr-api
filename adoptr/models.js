'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AdoptrSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  animal: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  altered: {
    type: Boolean,
    required: true
  },
  hasShots: {
    type: Boolean,
    required: true
  },
  housetrained: {
    type: Boolean,
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    }
  }
});

AdoptrSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    animal: this.animal,
    name: this.name,
    age: this.age,
    size: this.size,
    breed: this.breed,
    sex: this.sex,
    altered: this.altered,
    hasShots: this.hasShots,
    housetrained: this.housetrained,
    contact: {
      phone: this.contact.phone,
      email: this.contact.email,
      address1: this.contact.address1,
      address2: this.contact.address2,
      city: this.contact.city,
      state: this.contact.state,
      zip: this.contact.zip
    }
  };
};

const AdoptrPreferencesSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  dog: {
    type: Boolean,
    default: false
  },
  cat: {
    type: Boolean,
    default: false
  },
  puppyOrKitten: {
    type: Boolean,
    default: false
  },
  young: {
    type: Boolean,
    default: false
  },
  adult: {
    type: Boolean,
    default: false
  },
  senior: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  },
  medium: {
    type: Boolean,
    default: false
  },
  large: {
    type: Boolean,
    default: false
  },
  extraLarge: {
    type: Boolean,
    default: false
  },
  male: {
    type: Boolean,
    default: false
  },
  female: {
    type: Boolean,
    default: false
  },
  goodWithChildren: {
    type: Boolean,
    default: false
  },
  goodWithDogs: {
    type: Boolean,
    default: false
  },
  goodWithCats: {
    type: Boolean,
    default: false
  },
  spayedNeutered: {
    type: Boolean,
    default: false
  },
  hasVaccinations: {
    type: Boolean,
    default: false
  },
  housetrained: {
    type: Boolean,
    default: false
  }
});

const Adoptr = mongoose.model('Adoptr', AdoptrSchema);

const AdoptrPreferences = mongoose.model('Adoptr Preferences', AdoptrPreferencesSchema);

module.exports = {AdoptrPreferences, Adoptr};
