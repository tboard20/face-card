const nameDisplay = document.getElementById("name-display") as HTMLElement;
const nameInput = document.getElementById("name-input") as HTMLInputElement;
const enterButton = document.getElementById("enter-btn") as HTMLButtonElement;

function handleNameChange(): void {
    const typedName: string = nameInput.value;
    nameDisplay.innerText = typedName || "Type your name...";

    // --- NEW LOGIC: SHOW/HIDE BUTTON ---
    if (typedName.length > 0) {
        // If there is text, show the button
        enterButton.style.display = "block";
    } else {
        // If empty, hide the button
        enterButton.style.display = "none";
    }
}

// When the button is clicked
function handleEnterClick(): void {
    alert("Welcome, " + nameInput.value + "!");
}

nameInput.addEventListener("input", handleNameChange);
enterButton.addEventListener("click", handleEnterClick);
