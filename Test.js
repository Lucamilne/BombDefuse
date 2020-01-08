var difficulty = 6;
var colors = generateColors(difficulty);
var pickedColor = randomColor();
var squares = document.querySelectorAll(".wire");
var easy = document.querySelector("#easy");
var medium = document.querySelector("#medium");
var hard = document.querySelector("#hard");
var message = document.querySelector("#message");
var pickedColorDisplay = document.querySelector("#goal");
var bombNumber = document.querySelectorAll(".bomb-number");
var display = document.querySelector("#calc-display");
var clearDisplay = document.querySelector("#clear");
var backspace = document.querySelector("#backspace");
var LED = document.querySelector(".LED");
var LEDdetonate = document.querySelector("#detonate");
var displayContent = [];
// secret difficulty?

function random() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function generateColors(difficulty) {
    var arr = [];
    for (let i = 0; i < difficulty; i++) {
        arr.push(random());
    }
    return arr;
}

function randomColor() {
    let randIndexOfColors = Math.floor(Math.random() * difficulty);
    return colors[randIndexOfColors];
}

function setDifficulty(val) {
    if (difficulty !== val) {
        difficulty = val;
        resetGame();
    }
}

function resetGame() {
    document.querySelector("h1").style.borderColor = "";
    message.textContent = "";
    colors = generateColors(difficulty);
    pickedColor = randomColor();
    pickedColorDisplay.textContent = pickedColor;
    for (let i = 0; i < 9; i++) {
        squares[i].style.display = "none";
    }
    newGame()
    resetIdleLED();
}

function newGame() {
    for (let i = 0; i < difficulty; i++) {
        squares[i].style.display = "block";
        squares[i].style.borderColor = colors[i];
        squares[i].addEventListener("click", function () {
            if (this.style.borderColor === pickedColor) {
                correct();
            } else {
                message.textContent = "Please try again";
                this.style.display = "none";
                detonate();
            }
        })
    }
    resetDisplay();
};

//h1 is not resetting correctly.
function correct() {
    document.querySelector("h1").style.backgroundColor = pickedColor;
    message.textContent = "Correct! Play again?";
    reset.textContent = "Choose new colours";
    defusal();
    display.textContent = "Err";
}

easy.addEventListener("click", function () {
    setDifficulty(3);
    easy.style.classList.add("selected");
    medium.style.classList.remove("selected");
    hard.style.classList.remove("selected");
})

medium.addEventListener("click", function () {
    setDifficulty(6);
    easy.style.classList.remove("selected");
    medium.style.classList.add("selected");
    hard.style.classList.remove("selected");
})

hard.addEventListener("click", function () {
    setDifficulty(9);
    easy.style.classList.remove("selected");
    medium.style.classList.remove("selected");
    hard.style.classList.add("selected");
})

reset.addEventListener("click", resetGame);

clearDisplay.addEventListener("click", resetDisplay);

//this is not working correctly.
backspace.addEventListener("click", function () {
    if (displayContent.length > 1) {
        displayContent.pop();
        displayContentUpdate();
    }
    else {
        displayContent.pop();
        display.textContent = 0;
    }
})

//LCD screen interactivity
function displayContentUpdate() {
    if (display.textContent.length < 8) {
        display.textContent = displayContent.join('');
    }
};

function resetDisplay() {
    display.textContent = 0;
    displayContent = [];
}

for (let i = 0; i < bombNumber.length; i++) {
    bombNumber[i].addEventListener("click", function () {
        displayContent.push(this.textContent);
        displayContentUpdate();
    })
};

//LED interaction
function resetIdleLED() {
    LED.classList.remove("LED-correct", "LED-incorrect");
    LEDdetonate.classList.remove("detonate")
    LED.classList.add("LED-idle");
}

function defusal() {
    LED.classList.remove("LED-idle", "LED-incorrect")
    LEDdetonate.classList.remove("detonate");
    LED.classList.add("LED-correct");
}

function detonate() {
    LED.classList.remove("LED-idle");
    LED.classList.add("LED-incorrect");
    LEDdetonate.classList.add("detonate");
}

resetGame();
