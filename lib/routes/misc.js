'use strict';

var app = module.exports = require('express')();
var cache = require('../cache');
var request = require('request');
var Promise = require('bluebird');
var utils = require('../utils');
app.get('/maps',function(req,res){
  cache('maps',function(){
    return new Promise(function(yes,no){
      yes(utils.maps);
    });
  }).then(function(v){
    return res.jsonp(v);
  },function(e){
    return res.jsonp(500,e);
  });
});
app.get('/',function(req,res){
  res.render('maps',utils);
});