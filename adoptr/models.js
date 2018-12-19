'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AdoptrMatchSchema = mongoose.Schema({
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
  animalId: {
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
    },
  },
  photo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

AdoptrMatchSchema.methods.serialize = function() {
  return {
    id: this._id,
    animal: this.animal,
    name: this.name,
    age: this.age,
    size: this.size,
    animalId: this.animalId,
    breed: this.breed,
    sex: this.sex,
    altered: this.altered,
    hasShots: this.hasShots,
    housetrained: this.housetrained,
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

const AdoptrSchema = mongoose.Schema({
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
  },
  savedMatches: [AdoptrMatchSchema]
});

AdoptrSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    dog: this.animal.dog,
    cat: this.animal.cat,
    puppyOrKitten: this.age.puppyOrKitten,
    young: this.age.young,
    adult: this.age.adult,
    senior: this.age.senior,
    small: this.size.small,
    medium: this.size.medium,
    large: this.size.large,
    extraLarge: this.size.extraLarge,
    male: this.gender.male,
    female: this.gender.female,
    children: this.goodWith.children,
    dogs: this.goodWith.dogs,
    cats: this.goodWith.cats,
    altered: this.health.altered,
    hasShots: this.health.hasShots,
    housetrained: this.health.housetrained
  };
};

const Adoptr = mongoose.model('Adoptr', AdoptrSchema);

module.exports = {Adoptr};
