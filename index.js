const url = require('url');
const R = require('ramda');
const rot13 = require('rot-13');

// match :: RegExp -> Request -> _Response -> Route
const match = R.curry((route, req, _res) => route.test(req.url));

// urlParse :: String -> Object
const urlParse = x => url.parse(x, true);

// rot13Route :: Request -> Response -> String
const rot13Route = R.curry((req, _res) => R.pipe(
  R.prop('url'),
  urlParse,
  R.path(['query', 'rot13']),
  rot13
)(req));

module.exports = R.cond([

  // `/ping/`, see http://regexr.com/3fktc
  [ match(/^\/ping[\/]?$/), R.always('pong') ],

  // `/?rot13=yolo`, see http://regexr.com/3fkto
  [ match(/^\/\?rot13=\w{1,}$/), rot13Route ],

  // everything else
  [ R.T, R.always('Not Implemented') ],
])
