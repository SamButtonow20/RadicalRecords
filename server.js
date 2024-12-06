"use strict";
const express = require("express");
const app = express();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// To upload JSON
module.exports = {app, upload};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Auth setup
const session = require('express-session');
const passport = require('passport');
require("./auth/passport");
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', require('./auth/auth.route'));

// Views setup
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Routes
const routes = require('./routes/routes');
const { db_close } = require("./database/db");
app.use("/", routes);

// Admin routes
const adminRoutes = require('./routes/routes');
app.use('/admin', adminRoutes);

// Home Page
app.get("/", (req, res) => {
    req.session.returnTo = req.originalUrl;
    res.render("index", {
        title: 'Home Page',
        user: req.user
    });
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("App listening at http://localhost/:" + PORT);
});

process.on("SIGINT", cleanUp);

function cleanUp() {
    console.log("Terminate signal received.");
    db_close();
    console.log("...Closing HTTP server.");
    server.close(() => {
        console.log("...HTTP server closed.")
    });
}
