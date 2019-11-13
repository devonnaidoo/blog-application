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
  var topics = db.get("topics");
  topics.find({}, {}, (err, topics) => {
    res.render("newTopic", { title: "New Topic", topics: topics });
    console.log(topics);
  });
});

router.post("/add", function(req, res, next) {
  // Storing form values
  var topic = req.body.topic;

  // Form Validation
  req.checkBody("topic", "Oops, your post requires a title").notEmpty();

  // Checking Errors
  var errors = req.validationErrors();

  if (errors) {
    res.render("newTopic", {
      errors: errors
    });
  } else {
    var topics = db.get("topics");

    // Find if the array contains an object by comparing the property value
    // if (persons.some(person => person.name === "H")) {
    //   document.write("Object found inside the array.");
    // } else {
    //   document.write("Object not found.");
    // }
    // Add to db
    topics.insert(
      {
        name: topic
      },
      (err, post) => {
        if (err) {
          res.send(err);
        } else {
          req.flash("success", "Topic Added");
          res.location("/");
          res.redirect("/");
        }
      }
    );
  }
});

module.exports = router;
