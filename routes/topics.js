var express = require("express");
var router = express.Router();
var multer = require("multer");
// Handle File Uploads
var upload = multer({ dest: "uploads/" });
var expressValidator = require("express-validator");
var mongo = require("mongodb");
var db = require("monk")("localhost/blogapp");

/* GET listing. */
router.get("/add", function(req, res, next) {
  //   var topics = db.get("topics");
  //   topics.find({}, {}, (err, topics) => {
  res.render("newTopic", { title: "New Topic" });
  //   });
});
