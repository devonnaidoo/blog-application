var express = require("express");
var router = express.Router();

/* GET listing. */
router.get("/add", function(req, res, next) {
  res.render("newPost", {
    title: "New Post"
  });
});

module.exports = router;
