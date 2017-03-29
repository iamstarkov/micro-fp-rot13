const url = require('url');
const R = require('ramda');
const rot13 = require('rot-13');
const { STATUS_CODES } = require('http');
const { send } = require('micro');

// match :: RegExp -> Request -> Route
const match = R.curry((route, req) => route.test(req.url));

// urlParse :: String -> Object
const urlParse = x => url.parse(x, true);

// rot13Route :: Request -> String
const rot13Route = R.pipe(
  R.prop('url'),
  urlParse,
  R.path(['query', 'rot13']),
  rot13
);

// http :: Function -> Number -> _Request -> Response -> fn(Response, code, codeDescription)
const http = R.curry((fn, code, _req, res) => fn(res, code, STATUS_CODES[code]))

module.exports = R.cond([

  // `/ping/`, see http://regexr.com/3fktc
  [ match(/^\/ping[\/]?$/), R.always('pong') ],

  // `/?rot13=yolo`, see http://regexr.com/3fkto
  [ match(/^\/\?rot13=\w{1,}$/), rot13Route ],

  // everything else
  [ R.T, http(send, 501) ],
]);
