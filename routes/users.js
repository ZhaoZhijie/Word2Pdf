var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(`enter router users`)
  res.send('respond with a resource');
});

module.exports = router;
