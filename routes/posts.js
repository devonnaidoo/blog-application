var express = require("express");
var router = express.Router();

/* GET listing. */
router.get("/add", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
