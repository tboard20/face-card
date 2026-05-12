var nameDisplay = document.getElementById("name-display");
var nameInput = document.getElementById("name-input");
var enterButton = document.getElementById("enter-btn");

function handleNameChange() {
    var typedName = nameInput.value;
    nameDisplay.innerText = typedName || "Type your name...";

    if (typedName.length > 0) {
        enterButton.style.display = "block";
    } else {
        enterButton.style.display = "none";
    }
}

function handleEnterClick() {
    alert("Welcome, " + nameInput.value + "!");
}

nameInput.addEventListener("input", handleNameChange);
enterButton.addEventListener("click", handleEnterClick);
