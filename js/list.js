// given "this" is the <input type="checkbox"/>
// toggle visibility of text strike-through and abandon button
function check() {
    let parent = $(this).parent().parent().parent(); // it's gross, I know
    parent.children("span").toggleClass("line-through"); // add / remove line through effect
    parent.children().last().toggleClass("hidden"); // add / remove abandon button visibility
    console.log("Task '" + parent.find("span").text() + "' checked");

}

// prepends checkbox to given parent element
function addCheckbox(parent) {
    let mrSet = $("<div></div>").addClass("input-group-prepend"); // create input group prepend div
    let mrSetJr = $("<div></div>").addClass("input-group-text"); // create input group text div
    mrSetJr.append($("<input/>").attr("type", "checkbox")); // create checkbox
    mrSetJr.children().first().on("click", check); // attach event listener to checkbox click
    mrSet.append(mrSetJr); // attach checkbox to div
    parent.prepend(mrSet); // attach checkbox div to parent div
}

// deletes checkbox from given parent element
function removeCheckbox(parent) {

    let prepend = parent.children().first(); // get first child of element
    console.log(prepend.find("input"));
    if (prepend.find("input").length > 0) { // check there is a checkbox prepended
        prepend.remove(); // remove prepended element
        console.log("Checkbox removed");
    }
}


function showCheckbox(parent) {
    let checkboxArea = parent.children().first();
    if (checkboxArea.hasClass("hidden")) {
        checkboxArea.removeClass("hidden");
    }
}

function hideCheckbox(parent) {
    let checkboxArea = parent.children().first();
    if (!checkboxArea.hasClass("hidden")) {
        checkboxArea.addClass("hidden");
    }
}


// assume the event was attached with the "one()" method
// change button text to "claim" and add event listener
function abandon() {

    let btn = $(this); // get button element
    let parent = btn.parent().parent(); // get button grandparent
    btn.text("Claim"); // change text to "claim"
    btn.one("click", claim); // add abandon event handler

    // removeCheckbox(parent); // hide checkbox
    hideCheckbox(parent); // hide checkbox
    console.log("Task '" + parent.find("span").text() + "' abandoned");
}

// assume the event was attached with the "one()" method
// change button text to "abandon" and add event listener
function claim() {

    let btn = $(this); // get button element
    let parent = btn.parent().parent(); // get button grandparent
    btn.text("Abandon"); // change text to "abandon"
    btn.one("click", abandon); // add claim event listener

    // addCheckbox(parent); // add checkbox
    showCheckbox(parent); // show checkbox
    console.log("Task '" + parent.find("span").text() + "' claimed");
}

// creates and prepends a div with a checkbox, an
// abandon button, and text from "new task" field
function addTask() {
    let newText = $("#newTask").val(); // get text from "add" element
    if (newText == "" || newText == null) { return; } // no text added!?!? Get outta here!

    let newTask = $("<article></article>").addClass("input-group mb-3"); // create parent article

    addCheckbox(newTask); // create checkbox prepend

    // create task text
    let mrSet = $("<span></span>").addClass("input-group-text form-control"); // create input group text span
    mrSet.text(newText); // insert new text into span
    newTask.append(mrSet); // attach text span

    // create abandon button
    mrSet = $("<div></div>").addClass("input-group-append") // create input group append div
    let mrSetJr = $("<button></button>").addClass("btn btn-outline-secondary"); // create abandon button
    mrSetJr.attr("type", "button"); // add button attribute
    mrSetJr.text("Abandon"); // add button text
    mrSetJr.first().one("click", abandon); // attach event listener to abandon click
    mrSet.append(mrSetJr); // append button to div
    newTask.append(mrSet); // append button div to parent div

    let addTask = $("#newTask"); // get "add new task" bar
    addTask.parent().parent().before(newTask); // insert new task before "add new task" bar
    addTask.val(""); // clear add task text

    let newId = $("#newId"); // get id of new task
    newId.value++; // increment id to new, unique value

    console.log("New task '" + newText + "' added");

}

// remove all completed tasks
function removeComplete() {
    

    let articles = $("span.line-through").parent(); // collect articles
    articles.removeClass("disappear-left");
    // articles.children().text(""); // blank out text
    
    articles.addClass("disappear-left"); // add animation class
    
    setInterval(function () { // wait for animation duration
        // articles.remove(); // then delete
        articles.addClass("hidden");
    }, 500);
    console.log("Completed tasks hidden");
};


$(document).ready(function () {
    console.log("list.js jQuery loaded successfully.");

    // add click event listeners for existing checkboxes
    $(":checkbox").each(function () { // for every checkbox
        // line is striked and box unchecked OR line is unstriked and box is checked
        if ($(this).prop("checked") && !($(this).parent().parent().next().hasClass("line-through")) ||
            !($(this).prop("checked")) && $(this).parent().parent().next().hasClass("line-through")) {
            $(this).click(); // toggle the check in the 'mismatched' cases
        }
        $(this).on("click", check); // add line-through change for checkbox click
    });

    // add click event listeners for existing claim/abandon buttons
    $(":button").each(function () { // for every button
        console.log("text result: " + $(this).text() + "\nsearch result: " + $(this).text().search("Abandon"));
        if ($(this).text().search("Abandon") != -1) {
            $(this).one("click", abandon);
        } else if ($(this).text().search("Claim") != -1) {
            $(this).one("click", claim);
        }
    });

    // add timer for hiding the logout button
    $("#accordion").on("mouseleave", (function () {
        let logoutTimer = setTimeout(function () { // after two seconds
            // if the button is shown and the mouse is not hovering over
            if ($("#logoutCollapse").hasClass("show") && ($("#accordion:hover").length == 0)) {
                $("#buttonLogout").click(); // hide the button
            }
        }, 1000);
    }));
    // add event listeners for 'add' and 'remove' buttons
    $("#buttonAdd").on("click", addTask); // create new task when you click the add button
    $("#buttonRemove").on("click", removeComplete); // remove completed tasks when you click the remove button
});
