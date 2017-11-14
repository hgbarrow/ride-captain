var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
    id: 1,
    username: "samsepi01"
  }, {
    id: 2,
    username: "D0loresHAxe"
  }
  ])
});

module.exports = router;
