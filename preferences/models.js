'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PreferencesSchema = mongoose.Schema({
  username: {
    type: String
  },
  dog: {
    type: Boolean
  },
  cat: {
    type: Boolean
  },
  puppyOrKitten: {
    type: Boolean
  },
  young: {
    type: Boolean
  },
  adult: {
    type: Boolean
  },
  senior: {
    type: Boolean
  },
  small: {
    type: Boolean
  },
  medium: {
    type: Boolean
  },
  large: {
    type: Boolean
  },
  extraLarge: {
    type: Boolean
  },
  male: {
    type: Boolean
  },
  female: {
    type: Boolean
  },
  children: {
    type: Boolean
  },
  dogs: {
    type: Boolean
  },
  cats: {
    type: Boolean
  },
  altered: {
    type: Boolean
  },
  hasShots: {
    type: Boolean
  },
  housetrained: {
    type: Boolean
  }
});

PreferencesSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    dog: this.dog,
    cat: this.cat,
    puppyOrKitten: this.puppyOrKitten,
    young: this.young,
    adult: this.adult,
    senior: this.senior,
    small: this.small,
    medium: this.medium,
    large: this.large,
    extraLarge: this.extraLarge,
    male: this.male,
    female: this.female,
    children: this.children,
    dogs: this.dogs,
    cats: this.cats,
    altered: this.altered,
    hasShots: this.hasShots,
    housetrained: this.housetrained
  };
};

const Preferences = mongoose.model('Preference', PreferencesSchema);

module.exports = {Preferences};
