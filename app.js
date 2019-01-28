let express = require("express");
let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require("./models/comment");
let seedDB = require("./seeds");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("./models/user");
let methodOverride = require("method-override");
let flash = require("connect-flash");

let commentRoutes = require("./routes/comments");
let campgroundRoutes = require("./routes/campgrounds");
let indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://127.0.0.1/yelp_camp", {useNewUrlParser: true});
mongoose.connect("mongodb://Songchen:mongodb660@ds213755.mlab.com:13755/yelp_camp"); 

// seedDB();

var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
  secret: "Thunder is the NBA champion.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("The YelpCamp Server Has Started!");
});