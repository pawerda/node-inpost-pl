'use strict';

var API_URI = 'https://api.paczkomaty.pl/?';
var TEST_AUTH_DATA = {
  email: 'test@testowy.pl',
  password: 'WqJevQy*X7'
};
var request = require('request');
var xmlToJson = require('xml2json').toJson;
var jsonToXml = require('jsontoxml');
var extend = require('extend');

var APIRequest = function (options) {
  this.test = options.test;
  this.authData = options.auth ? options.auth : this.test ? TEST_AUTH_DATA : {};
  this.raw = options.raw;
};

APIRequest.xmlParse = function (str, opts) {
  opts = opts || {object: true};
  var args = [str, opts];
  return xmlToJson.apply(null, args);
};

function makeRequest(method, options, cb) {
  var raw = options.raw;
  var args = [];
  var callbackWrap;
  var isBodyXml;

  args.push(options);

  if (cb) {
    callbackWrap = function (callback) {
      return function (error, response, body) {
        isBodyXml = body.indexOf('<') == 0;
        if (error) {
          return callback(error)
        } else if (isBodyXml && !raw) {
          body = APIRequest.xmlParse(body);
        }
        return callback(error, body, response)
      }
    };
    args.push(callbackWrap(cb))
  }
  return request[method].apply(null, args)
}

APIRequest.prototype.setGet = function (settings) {
  var self = this;
  var getQuery = {
    do: settings.action
  };
  return function (params, cb) {
    params = params || {};
    if ('function' === typeof params) {
      cb = params;
      params = getQuery;
    } else {
      extend(true, params, getQuery);
    }
    return self.get(params, cb)
  }
};

APIRequest.prototype.setPost = function (settings) {
  var self = this;
  var postSettings = {
    form: self.authData,
    query: {do: settings.action}
  };
  return function (form, cb) {
    form = form || {};
    if ('function' === typeof form) {
      cb = form;
    } else {
      extend(true, postSettings.form, form);
    }
    return self.post(postSettings, cb);
  }
};

APIRequest.prototype.get = function (query, cb) {
  var self = this;
  var reqOptions = {
    uri: API_URI,
    qs: query,
    raw: self.raw
  };
  return makeRequest('get', reqOptions, cb);
};

APIRequest.prototype.post = function (settings, cb) {
  var self = this;
  var reqOptions = {
    uri: API_URI,
    qs: settings.query,
    form: settings.form,
    raw: self.raw
  };
  var isContentFieldObject = 'object' === typeof reqOptions.form.content;
  if (isContentFieldObject) {
    reqOptions.form.content = jsonToXml(reqOptions.form.content);
  }
  return makeRequest('post', reqOptions, cb)
};

module.exports = APIRequest;