//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');

const uri = "mongodb+srv://vinit:vinit123@cluster0.orohzmx.mongodb.net/udemy?retryWrites=true&w=majority";

mongoose.set('strictQuery', false);
// database connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });



const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true

}));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});
app.post('/register', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            email: req.body.username,
            password: hash
        });
        console.log("*** Data added successfully to DB ***");
        console.log(newUser);
        res.render("secrets");
    } catch (error) {
        console.log("--- Sorry, data was not added to the DB due to the error below ---");
        console.log(error);
        res.redirect("/");
    }
});


app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username });

        if (foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.render("secrets");
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.redirect("/login"); // Error occurred, redirect back to login page
    }
});

app.listen (3000, function() {
    console.log("Server started on port 3000.");
});