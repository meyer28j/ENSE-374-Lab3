console.log("File index.js loaded successfully");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

const jsonFunctions = require(__dirname + "/js/jsonFunctions.js");
const Task = jsonFunctions.Task;
const User = jsonFunctions.User;
const appendToUsers = jsonFunctions.appendToUsers;
const getUserFromUsername = jsonFunctions.getUserFromUsername;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));
app.set("view engine", "ejs");

app.listen(port, function () {
    console.log("Server is running on port: " + port);
});

app.get("/", function (request, response) {
    // response.render("index");
    response.render("login");
});

app.get("/login", function (request, response) {
    response.render("login");
});

app.post("/login", function (request, response) {
    console.log("directed to route 'login'");
    let loginEmail = request.body.loginEmail;
    let loginPassword = request.body.loginPassword;
    let userToVerify = getUserFromUsername(loginEmail);
    if (userToVerify) {
        if (userToVerify.password == loginPassword) {
            console.log("username and password matched");
            response.redirect(307, "/todo");
        }
    }
    // no username match
    response.redirect("/");
});

app.post("/register", function (request, response) {
    console.log("directed to route 'register'");
    let emailInput = request.body.signupEmail;
    let passwordInput = request.body.signupPassword;
    let userToVerify = getUserFromUsername(emailInput);
    if (userToVerify) { // user exists, cancel signup
	console.log(emailInput + " is already taken as a username.");
	response.redirect("/");
    } else { // user name free
	let newUser = new User(emailInput, passwordInput);
	console.log("creating new user...\nusername: " +
		    newUser.username + "\npassword: " +
		    newUser.password);
	appendToUsers(newUser);
	response.redirect(307, "/todo");
    }
});

app.post("/todo", function (request, response) {
    console.log("directed to route 'todo'");
    response.render("list");
});
