var lyft =  require('node-lyft');
var express = require('express');
var router = express.Router();
var axios = require('axios');
var request = require('request');
let defaultClient = lyft.ApiClient.instance;
let clientAuth = defaultClient.authentications['Client Authentication'];

var home = [37.7944688, -122.2754892]
var end = [37.8719034,-122.2607286,17]


require('dotenv').config();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
    id: 1,
    username: "henry",
    Client: process.env.CONFIG_LYFT_CLIENT_ID
  }, {
    id: 2,
    username: "barrow"
  }
  ])
});

function getToken(done) {
    request({
        url: 'https://api.lyft.com/oauth/token',
        method: 'POST',
        auth: {
            user:  process.env.CONFIG_LYFT_CLIENT_ID,
            pass:  process.env.CONFIG_LYFT_CLIENT_SECRET
        },
        form: {
            'grant_type': 'client_credentials'
        }
    }, function(err, data){
        var json = JSON.parse(data.body);
        done(json.access_token)
    })
}

function setToken(done){
    getToken((token)=> {
        clientAuth.accessToken = token;
        done();
    })
}

router.post('/eta', function(req, res, next) {
    let apiInstance = new lyft.PublicApi();
    var lat = home[0];
    var lng = home[1];
    if(req.body.start){
        lat = req.body.start.lat;
        lng = req.body.start.lng;
    }
    apiInstance.getETA(lat, lng).then((data) => {
        res.json(data);
        }, (error) => {
        console.error("Token not set, setting auth token")
        setToken(function(){
            res.redirect(307, '/lyft/eta')
        })
    });
});

router.post('/cost', function(req, res, next) {
    let apiInstance = new lyft.PublicApi();
    var opts = {
        endLat: end[0],
        endLng: end[1]
    }
    var lat = home[0];
    var lng = home[1];
    if(req.body.start){
        lat = req.body.start.lat;
        lng = req.body.start.lng;
        opts.endLat = req.body.end.lat;
        opts.endLng = req.body.end.lng;
    }
    
    apiInstance.getCost(lat, lng, opts).then((data) => {
        res.json(data);
        }, (error) => {
        console.error("Token not set, setting auth token")
        setToken(function(){
            res.redirect('/lyft/cost')
        })
    });
});

router.post('/cost', function(req, res) {
    console.log(req.body);
    res.json({"error":"this is an error"})
});

module.exports = router;
