require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltrounds = 10;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("detail", userSchema);


app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltrounds, function (err, hash) {
        const newuser = new User({
            email: req.body.username,
            password: hash
        })
        newuser.save(function (err) {
            if (err)
                console.log(err);
            else res.render("secrets");
        })
    })

});

app.post("/login", function (req, res) {

    const username = req.body.username;
    const password = (req.body.password);

    User.findOne({ email: username }, function (err, founduser) {
        if (err)
            console.log(err);

        else if (founduser) {
                bcrypt.compare(password, founduser.password, function (err, result) {
                    if (result)
                        res.render("secrets");
                    else res.send("INVALID USERID OR PASS");
                });
        }
        else res.send("INVALID USERID OR PASS");
    });

});





app.listen(3000, function () {
    console.log("HI");
});