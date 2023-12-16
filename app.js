var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var orderRouter = require("./routes/order");
var signRouter = require("./routes/sign");

var app = express();

/**
 *
 * Session
 */

app.use(
  session({
    secret: "45678()(*&*&",
    resave: false,
    saveUninitialized: true,
    cookie: { basket: [], userId: "" },
  })
);

/**
 *
 *
 */
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/order", orderRouter);
app.use("/sign", signRouter);

// catch 404 and forward to error handler
app.use(async (req, res, next) => {
  next(createError(404));
});

// error handler
app.use(async (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;