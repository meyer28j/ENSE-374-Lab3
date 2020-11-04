console.log("File index.js loaded successfully");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

const jsonFunctions = require(__dirname + "/js/jsonFunctions.js");
const Task = jsonFunctions.Task;
const User = jsonFunctions.User;
const loadAllTaskData = jsonFunctions.loadAllTaskData;
const appendToTasks = jsonFunctions.appendToTasks;
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
    response.redirect("/login");
});

app.get("/login", function (request, response) {
    console.log("directed to route 'login'");
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
            response.redirect(307, "/todo?username=" + userToVerify.username);
        } else { // username match, no password match
            console.log("existing username, incorrect password");
            response.redirect("/login");
        }
    } else { // no username match
    response.redirect("/login");
    }
});

app.post("/register", function (request, response) {
    console.log("directed to route 'register'");
    let emailInput = request.body.signupEmail;
    let passwordInput = request.body.signupPassword;
    let userToVerify = getUserFromUsername(emailInput);
    if (userToVerify) { // user exists, cancel signup
	console.log(emailInput + " is already taken as a username.");
	response.redirect("/");
    } else { // user name is available
	let newUser = new User(emailInput, passwordInput);
	console.log("creating new user...\nusername: " +
		    newUser.username + "\npassword: " +
		    newUser.password);
    appendToUsers(newUser);
	response.redirect(307, "/todo?username=" + newUser.username);
    }
});

app.post("/todo", function (request, response) {
    console.log("directed to route 'todo'");
    let standInTitle = "Stand-In Title";
    let taskList = loadAllTaskData();
    response.render("list", {title: standInTitle, username: request.query.username, tasks: taskList});
});

app.get("/logout", function (request, response) {
    console.log("directed to route 'logout'");
    response.redirect("/login");
});

app.post("/addTask", function (request, response) {
    console.log("directed to route 'addTask'");
    // refer to post /register
    let id = request.body.newId;
    let nameInput = request.body.newTask;
    let owner = request.body.creator;
    let creator = owner;
    let newTask = new Task(id, nameInput, owner, creator, false, false)
    appendToTasks(newTask)
});

app.post("/claim", function (request, response) {

});

app.post("abandonOrComplete", function (request, response) {

});

app.post("unfinish", function (request, response) {

});
app.post("purge", function (request, response) {

});