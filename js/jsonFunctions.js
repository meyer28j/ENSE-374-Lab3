// console.log("File jsonFunctions.js loaded successfully.");

const fs = require("fs");
const usersFile = __dirname + "/users.json";
const tasksFile = __dirname + "/tasks.json";

class Task {
    constructor(id1, name1, owner1, creator1, done1, cleared1) {
        this._id = id1;
        this.name = name1;
        this.owner = owner1;
        this.creator = creator1;
        this.done = done1;
        this.cleared = cleared1;
    }
}

class User {
    constructor(username1, password1) {
        this.username = username1;
        this.password = password1;
    }
}

function loadAllUserData () {
    // read all user data from users.json and return as JSON
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

// TODO: ensure newUser is correct object
// PROBLEM: function loads and rewrites ALL JSON DATA.
//          This is horrible! Make it just append to existing data
function appendToUsers (newUser) {
    let allUserData = loadAllUserData();
    console.log("allUserData: " + allUserData);
    allUserData.push(newUser);
    let updatedUserData = JSON.stringify(allUserData);
    console.log("updatedUserData: " + updatedUserData);
    fs.writeFileSync(usersFile, updatedUserData, "utf8", function(err) {
        if (err) console.log(err);
    });
}

function getUserFromUsername (usernameSearch) {
    console.log("Searching " + usersFile + " for '" + usernameSearch + "'");
    
    let allUserData = loadAllUserData();
    for (user of allUserData) {
        if (user.username == usernameSearch) return user;
    }

    console.log("user not found");
    return null;
}

exports.Task = Task;
exports.User = User;
exports.appendToUsers = appendToUsers;
exports.getUserFromUsername = getUserFromUsername;