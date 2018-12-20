'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PreferencesSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  animal: {
    dog: {
      type: Boolean,
      required: true
    },
    cat: {
      type: Boolean,
      required: true
    }
  },
  age: {
    puppyOrKitten: {
      type: Boolean,
      required: true
    },
    young: {
      type: Boolean,
      required: true
    },
    adult: {
      type: Boolean,
      required: true
    },
    senior: {
      type: Boolean,
      required: true
    }
  },
  size: {
    small: {
      type: Boolean,
      required: true
    },
    medium: {
      type: Boolean,
      required: true
    },
    large: {
      type: Boolean,
      required: true
    },
    extraLarge: {
      type: Boolean,
      required: true
    }
  },
  gender: {
    male: {
      type: Boolean,
      required: true
    },
    female: {
      type: Boolean,
      required: true
    }
  },
  goodWith: {
    children: {
      type: Boolean,
      required: true
    },
    dogs: {
      type: Boolean,
      required: true
    },
    cats: {
      type: Boolean,
      required: true
    }
  },
  health: {
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
    }
  }
});

PreferencesSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    animal: {
      dog: this.animal.dog,
      cat: this.animal.cat,
    },
    age: {
      puppyOrKitten: this.age.puppyOrKitten,
      young: this.age.young,
      adult: this.age.adult,
      senior: this.age.senior
    },
    size: {
      small: this.size.small,
      medium: this.size.medium,
      large: this.size.large,
      extraLarge: this.size.extraLarge
    },
    gender: {
      male: this.gender.male,
      female: this.gender.female
    },
    goodWith: {
      children: this.goodWith.children,
      dogs: this.goodWith.dogs,
      cats: this.goodWith.cats
    },
    health: {
      altered: this.health.altered,
      hasShots: this.health.hasShots,
      housetrained: this.health.housetrained
    }
  };
};

const Preferences = mongoose.model('Preference', PreferencesSchema);

module.exports = {Preferences};
