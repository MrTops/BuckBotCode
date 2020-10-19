const moment = require('moment');

module.exports.out = message => console.log(`[${moment()}] ${message}`);