'use strict';

var express = require('express');
var ejs = require('ejs');

var middlewareBodyParser = require('body-parser');
var middlewareBasicAuth = require('basic-auth-connect');
var middlewareCacheHandler = require('afrostream-node-middleware-cachehandler');
var middlewareAllowPreflight = require('afrostream-node-middleware-preflight');
var middlewareAllowCrossdomain = require('afrostream-node-middleware-crossdomain');
var middlewareError = require('./middleware/error.js');

var alive = require('./controller.alive.js');

module.exports.create = function (options) {
  options = options || {};

  var app = express();
  app.set('startDate', new Date());
  app.set('x-powered-by', false);
  app.set('etag', false);
  if (options.views) {
    app.set('view engine', 'ejs');
    app.set('views', options.views);
    app.engine('html', ejs.renderFile);
  }
  // alive is the only route unprotected by basicAuth
  app.get('/alive', alive);
  if (options.basicAuth) {
    app.use(middlewareBasicAuth(options.basicAuth.user, options.basicAuth.password));
  }
  //
  app.use(middlewareBodyParser.text({type: 'text/xml'}));
  app.use(middlewareBodyParser.urlencoded({extended: false, limit:'500kb'}));
  app.use(middlewareBodyParser.json({limit:'500kb'}));
  //
  app.use(middlewareCacheHandler());
  app.use(middlewareAllowCrossdomain());
  app.use(middlewareAllowPreflight());
  app.use(middlewareError);
  //
  return app;
};