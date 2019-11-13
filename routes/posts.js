var express = require("express");
var router = express.Router();
var multer = require("multer");
// Handle File Uploads
var upload = multer({ dest: "./uploads/" });

/* GET listing. */
router.get("/add", function(req, res, next) {
  res.render("newPost", {
    title: "New Post"
  });
});

// Getting info from form
router.post("/add", upload.single("blogimage"), function(req, res, next) {
  // Storing form values
  var title = req.body.title;
  var author = req.body.author;
  var topic = req.body.topic;
  var body = req.body.body;
  var blogimage = req.body.blogimage;
  var date = new Date();

  console.log(title);
});

module.exports = router;
