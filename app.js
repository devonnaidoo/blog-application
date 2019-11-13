var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var session = require("express-session");
var multer = require("multer");
// Handle File Uploads
var upload = multer({ dest: "./uploads/" });

var expressValidator = require("express-validator");

var mongo = require("mongodb");
var db = require("monk")("localhost/blogapp");

var indexRouter = require("./routes/index");
var posts = require("./routes/posts");
var topics = require("./routes/topics");

var app = express();

// To make moment accessible globally
app.locals.moment = require("moment");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Validator middleware
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Express Session middleware - Handle Sessions
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

// Flash Express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Making the database accessible to the router
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/", indexRouter);
app.use("/posts", posts);
app.use("/topics", topics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
