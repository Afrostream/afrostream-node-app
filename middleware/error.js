'use strict';

module.exports = function (options) {
  return function(err, req, res, next) {
    console.error('[ERROR]: ' + (err && err.message || err || 'unknown'), err && err.stack || 'unknown');
    res.status(err.statusCode || 500).send({error:String(err)});
  };
};