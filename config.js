'use strict';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost/adoptr';
exports.TEST_DATABASE_URL = process.env.MONGOLAB_WHITE_URI || 'mongodb://localhost/adoptr-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';