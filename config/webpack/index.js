const utils = require('../utils');

utils.copySyncIfDoesntExist('./config/main.js', './config/main.local.js');
utils.createIfDoesntExist('./build');
utils.createIfDoesntExist('./build/public');

if (process.env.NODE_ENV === 'production') {
  console.info("a");
  if (process.env.GH_PAGES) {
    console.info("b");
    module.exports = require('./prodGhPages');
  } else {
    console.info("c");
    module.exports = require('./prod');
  }
} else {
  module.exports = require('./dev');
}
