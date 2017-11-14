var express = require('express');
var router = express.Router();
var axios = require('axios');
var request = require('request');
var Uber = require('node-uber');

require('dotenv').config();

var uber = new Uber({
    client_id: process.env.CONFIG_UBER_CLIENT_ID,
    client_secret: process.env.CONFIG_UBER_CLIENT_SECRET,
    server_token: process.env.CONFIG_UBER_SERVER_TOKEN,
    name: process.env.CONFIG_UBER_APP_NAME
})

var home = [37.7944688, -122.2754892]
var end = [37.8719034,-122.2607286,17]



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
    id: 1,
    username: "henry",
  }, {
    id: 2,
    username: "uber"
  }
  ])
});


router.post('/prod', function(req, res, next){
    var lat = req.body.start.lat;
    var lng = req.body.start.lng;
    uber.products.getAllForLocationAsync(lat, lng)
        .then(function(resp){
            res.json(resp);
        })
})

router.post('/cost', function(req, res, next){
    var startlat = req.body.start.lat,
        startlng = req.body.start.lng,
        endlat = req.body.end.lat,
        endlng = req.body.end.lng;
    uber.estimates.getPriceForRouteAsync(startlat, startlng, endlat, endlng)
        .then((resp)=>{
            res.json(resp);
        })
})

router.post('/eta', function(req, res, next){
    var lat = req.body.start.lat;
    var lng = req.body.start.lng;
    uber.estimates.getETAForLocationAsync(lat, lng)
    .then((resp)=>{
        res.json(resp)
    })
})


module.exports = router;
