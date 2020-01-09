var difficulty = 3;
var colors = generateColors(difficulty);
var pickedColor = randomColor();
var squares = document.querySelectorAll(".wire");
var easy = document.querySelector("#easy");
var medium = document.querySelector("#medium");
var hard = document.querySelector("#hard");
var reset = document.querySelector("#reset");
var pickedColorDisplay = document.querySelector("#goal");
var bombNumber = document.querySelectorAll(".bomb-number");
var display = document.querySelector("#calc-display");
var clearDisplay = document.querySelector("#clear");
var backspace = document.querySelector("#backspace");
var LED = document.querySelector(".LED");
var LEDdetonate = document.querySelector("#detonate");
var body = document.querySelector("body");
var displayContent = [];
// secret difficulty?

//color this 
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
    // message.textContent = "";
    colors = generateColors(difficulty);
    pickedColor = randomColor();
    pickedColorDisplay.textContent = pickedColor;
    for (let i = 0; i < 9; i++) {
        squares[i].style.display = "none";
    }
    newGame()
    generateRainbowText(pickedColorDisplay);
}

function newGame() {
    for (let i = 0; i < difficulty; i++) {
        squares[i].style.display = "block";
        squares[i].style.borderColor = colors[i];
        squares[i].addEventListener("click", check)
    }
    resetDisplay();
    resetIdleLED();
};

//remove h1 from js
function correct() {
    defusal();
    pickedBackgroundColor();
    //remove interactivity on game completion
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check)
    }
}

function check() {
    if (this.style.borderColor === pickedColor) {
        correct();
    } else {
        this.style.display = "none";
        detonate();
    }
};

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

// background colour functionality
function pickedBackgroundColor() {
    document.querySelector("body").style.backgroundColor = pickedColor;
}

body.style.backgroundColor = random();

// This is an experimental animated background generator
// function dynamicBackground() {
//     body.style.background = "linear-gradient(-45deg, " + random() + ", " + random() + ", " + random() + ", " + random() + ")";
//     body.style.backgroundSize = "400% 400%";
//     body.style.animation = "backgroundGradient 10s ease infinite"
// }

// dynamicBackground();

//LCD screen interactivity
function displayContentUpdate() {
    display.textContent = displayContent.join('');
};

function resetDisplay() {
    display.textContent = 0;
    displayContent = [];
}

for (let i = 0; i < bombNumber.length; i++) {
    bombNumber[i].addEventListener("click", function () {
        if (display.textContent.length < 8) {
            displayContent.push(this.textContent);
        }
        displayContentUpdate();
    })
};

//LED interaction (need to add sounds)

function resetIdleLED() {
    LED.classList.remove("LED-correct", "LED-incorrect");
    LEDdetonate.classList.remove("detonate")
    LED.classList.add("LED-idle");
    document.querySelector("#reset div").classList.remove("alert");
}

function defusal() {
    LED.classList.remove("LED-idle", "LED-incorrect")
    LEDdetonate.classList.remove("detonate");
    LED.classList.add("LED-correct");
    display.textContent = "88888888";
    //make reset button flash
    document.querySelector("#reset div").classList.add("alert");
}

function detonate() {
    LED.classList.remove("LED-idle");
    LED.classList.add("LED-incorrect");
    LEDdetonate.classList.add("detonate");
    display.textContent = "error";
}

resetGame();

//rainbow text

function generateRainbowText(element) {
    var text = element.innerText;
    element.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        let charElem = document.createElement("span");
        charElem.style.color = "hsl(" + (360 * i / text.length) + ",80%,50%)";
        charElem.innerHTML = text[i];
        element.appendChild(charElem);
    }
}