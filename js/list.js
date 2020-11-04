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

function addTask() {
    let addTaskFormElement = $("#addTask"); // this will be static
    let newTaskFormElement = addTaskFormElement.clone(); // this will be modified to become part of the list
    addTaskFormElement.find("#newTask").val("");

    // form attributes
    newTaskFormElement.attr("id", newTaskFormElement.children().first().attr("id"));
    newTaskFormElement.attr("name", newTaskFormElement.attr("id"));
    newTaskFormElement.attr("action", "/claim");

    // text attributes
    let newTaskTextElement = newTaskFormElement.find("#newTask");
    let newTaskText = newTaskTextElement.val();
    newTaskTextElement.replaceWith($("<span class=\"input-group-text form-control\">" + newTaskText + "</span>"));

    // button attributes
    let newTaskButtonElement = newTaskFormElement.find("#buttonAdd");
    newTaskButtonElement.attr("id", "");
    newTaskButtonElement.text("Claim");
    newTaskButtonElement.on("click", claim);

    // checkbox attributes
    newTaskFormElement.find(":checkbox").on("click", check);

    addTaskFormElement.before(newTaskFormElement);
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
