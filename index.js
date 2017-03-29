const url = require('url');
const R = require('ramda');
const rot13 = require('rot-13');
const http = require('http');
const micro = require('micro');

// send :: Number -> String -> _Request -> Response -> micro.send(Response, Number, String)
const send = R.curry((code, msg, _req, res) => micro.send(res, code, msg));

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

// httpError :: Number -> send(send, Number, String)
const httpError = code => send(code, http.STATUS_CODES[code]);

module.exports = R.cond([

  // `/ping/`, see http://regexr.com/3fktc
  [ match(/^\/ping[\/]?$/), R.always('pong') ],

  // `/?rot13=yolo`, see http://regexr.com/3fkto
  [ match(/^\/\?rot13=\w{1,}$/), rot13Route ],

  // everything else
  [ R.T, httpError(501) ],
]);
