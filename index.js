'use strict';

var express = require('express');
var ejs = require('ejs');

var middlewareBodyParser = require('body-parser');
var middlewareBasicAuth = require('basic-auth-connect');
var middlewareCacheHandler = require('afrostream-node-middleware-cachehandler');

var middlewareError = require('./middleware/error.js');

module.exports.create = function (options) {
  options = options || {};

  var app = express();
  //
  app.set('startDate', new Date());
  app.set('x-powered-by', false);
  app.set('etag', false);

  if (options.views) {
    app.set('view engine', 'ejs');
    app.set('views', options.views);
    app.engine('html', ejs.renderFile);
  }
  if (options.basicAuth) {
    app.use(middlewareBasicAuth(options.basicAuth.user, options.basicAuth.password));
  }
  app.use(middlewareBodyParser.json());
  app.use(middlewareCacheHandler());
  //
  app.use(middlewareError);
  //
  return app;
};