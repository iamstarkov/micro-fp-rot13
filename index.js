const R = require('ramda');

// match :: RegExp -> Request -> Route
const match = R.curry((route, req) => route.test(req.url));


module.exports = R.cond([
  // /ping/, see http://regexr.com/3fktc
  [ match(/^\/ping[\/]?$/), R.always('pong') ],
  // everything else
  [ R.T, R.always('Not Implemented') ],
])
