var express = require("express"),
    aws = require("aws-sdk"),
    multerS3 = require("multer-s3"),
    path = require("path"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index"),
    myPostRoutes = require("./routes/myPosts"),
    tagRoutes = require("./routes/tags");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));//for css and scripts
app.use(methodOverride("_method"));
app.use(flash());

//creating the database
/*mongoose.connect("mongodb://localhost/share3",{
    useUnifiedTopology: true,
    useNewUrlParser:true,
});*/
mongoose.connect("mongodb+srv://tanuj:piku1234@artcommunity.0gx5j.mongodb.net/share?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser:true,
});

//passport config
/*app.use(require("express-session")({
    secret: "He is a psycho",
    resave: false,
    saveUninitialized: false
}));*/
app.use(require("cookie-session")({
    secret: "He is a psycho",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user; //res.local will be available inj all templates
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//adding the routes
app.use(indexRoutes);
app.use("/posts", campgroundRoutes);
app.use("/tags", tagRoutes),
app.use("/myPosts",myPostRoutes);
app.use("/posts/:id/comments", commentRoutes);

var port = process.env.PORT || 8000;
app.listen(port,function(){
    console.log("Started at ", port);
});