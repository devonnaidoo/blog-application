var express = require("express");
var router = express.Router();
var multer = require("multer");
// Handle File Uploads
var upload = multer({ dest: "./public/images" });
var expressValidator = require("express-validator");
var mongo = require("mongodb");
var db = require("monk")("localhost/blogapp");

/* GET listing. */
router.get("/show/:id", function(req, res, next) {
  var posts = db.get("posts");

  posts.findOne({ _id: req.params.id }).then(post => {
    res.render("show", { post: post });
  });
});

router.get("/add", function(req, res, next) {
  var topics = db.get("topics");
  topics.find({}, {}, (err, topics) => {
    res.render("newPost", {
      title: "New Post",
      topics: topics
    });
  });
});

// Getting info from form
router.post("/add", upload.single("blogimage"), function(req, res, next) {
  // Storing form values
  var title = req.body.title;
  var author = req.body.author;
  var topic = req.body.topic;
  var body = req.body.body;
  var date = new Date();

  if (req.file) {
    var blogimage = req.file.filename;
  } else {
    var blogimage = "default-image.jpg";
  }

  // Form Validation
  req.checkBody("title", "Oops, your post requires a title").notEmpty();
  req.checkBody("body", "Oops, your post requires a body").notEmpty();
  req.checkBody("author", "Oops, your post requires a author").notEmpty();

  // Checking Errors
  var errors = req.validationErrors();

  if (errors) {
    res.render("newPost", {
      errors: errors
    });
  } else {
    var posts = db.get("posts");
    // Add to db
    posts.insert(
      {
        title: title,
        author: author,
        topic: topic,
        body: body,
        author: author,
        blogimage: blogimage,
        date: date
      },
      (err, post) => {
        if (err) {
          res.send(err);
        } else {
          req.flash("success", "Post Added");
          res.location("/");
          res.redirect("/");
        }
      }
    );
  }
});

// Getting info from comment form
router.post("/addcomment", function(req, res, next) {
  // Storing form values
  var postid = req.body.postid;
  var name = req.body.name;
  var body = req.body.body;
  var commentdate = new Date();

  // Form Validation
  req.checkBody("name", "Oops, your comment requires a name").notEmpty();
  req.checkBody("body", "Oops, your comment requires a body").notEmpty();

  // Checking Errors
  var errors = req.validationErrors();

  if (errors) {
    var posts = db.get("posts");
    posts.findById(postid, function(err, post) {
      res.render("show", {
        errors: errors,
        post: post
      });
    });
  } else {
    var comment = {
      name: name,
      body: body,
      commentdate: commentdate
    };

    var posts = db.get("posts");

    posts.update(
      {
        _id: postid
      },
      {
        $push: {
          comments: comment
        }
      },
      function(err, doc) {
        if (err) {
          throw err;
        } else {
          req.flash("success", "Comment added");
          res.location("/posts/show/" + postid);
          res.redirect("/posts/show/" + postid);
        }
      }
    );
  }
});

module.exports = router;
