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
var LEDdetonate = document.querySelector("#armed");
var body = document.querySelector("body");
var help = document.querySelector(".help");
var tooltip = document.querySelector("p");
var displayContent = [];
// secret difficulty?

//color generators 
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

//generic game functions
function setDifficulty(val) {
    if (difficulty !== val) {
        difficulty = val;
        resetGame();
    }
}

function resetGame() {
    document.querySelector("h1").style.borderColor = "";
    colors = generateColors(difficulty);
    pickedColor = randomColor();
    pickedColorDisplay.textContent = pickedColor;
    for (let i = 0; i < 9; i++) {
        squares[i].style.display = "none";
    }
    newGame();
}

function newGame() {
    for (let i = 0; i < difficulty; i++) {
        squares[i].style.display = "block";
        squares[i].style.borderColor = colors[i];
        squares[i].addEventListener("click", check)
    }
    resetDisplay();
    resetIdleLED();
    generateRainbowText(pickedColorDisplay);
};

function correct() {
    defusal();
    pickedBackgroundColor();
    //remove interactivity on game completion
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check)
    }
    //expand on this.
}

function check() {
    if (this.style.borderColor === pickedColor) {
        correct();
    } else {
        this.style.display = "none";
        armed();
    }
};

//event listeners

help.addEventListener("mouseover", function () {
    tooltip.style.display = "block";
});

help.addEventListener("mouseout", function () {
    tooltip.style.display = "none";
})

easy.addEventListener("click", function () {
    setDifficulty(3);
})

medium.addEventListener("click", function () {
    setDifficulty(6);
})

hard.addEventListener("click", function () {
    setDifficulty(9);
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

help.style.backgroundColor = random();

//LCD screen interactivity

function displayContentUpdate() {
    display.textContent = displayContent.join('');
};

function resetDisplay() {
    stopBlinkingText();
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

var id;

function blinkingText() {
    display.textContent = display.textContent == "press" ? "play" : "press";
}

function stopBlinkingText() {
    clearInterval(id);
}

//LED interaction

function resetIdleLED() {
    LED.classList.remove("LED-correct", "LED-incorrect");
    LEDdetonate.classList.remove("armed")
    LED.classList.add("LED-idle");
    document.querySelector("#reset div").classList.remove("alert");
}

//game states

function defusal() {
    LED.classList.remove("LED-idle", "LED-incorrect")
    LEDdetonate.classList.remove("armed");
    LED.classList.add("LED-correct");
    display.textContent = "defused";
    //make reset button flash
    document.querySelector("#reset div").classList.add("alert");
    //LCD display blinking
    id = setInterval(blinkingText, 1200);
}

function detonate() {
    LED.classList.remove("LED-idle");
    LED.classList.add("LED-incorrect");
    LEDdetonate.classList.add("armed");
}

// experimental armed function
let myTimeoutID;

function armed() {
    LED.classList.remove("LED-idle");
    LED.classList.add("LED-incorrect");
    LEDdetonate.classList.add("armed");
    display.textContent = "armed";
    myTimeoutID = setTimeout(function() {
        timer();
    }, 1000)
}

function timedFunctionClear() {
    clearTimeout(myTimeoutID);
}

function timer() {
    var second = difficulty + 1;
    var decisecond = 0;
    var centisecond = 0;
    display.textContent = "armed";
    var timer = setInterval(function () {
        display.textContent = '0' + second + ":" + decisecond + centisecond;
        centisecond--;
        if (centisecond < 0) {
            centisecond = 9;
            decisecond--;
            if (decisecond < 0) {
                decisecond = 9
                second--;
                if (second < 0) {
                    clearInterval(timer);
                }
            }
        }
    }, 10);
};

//run on startup

setTimeout(function () {
    help.style.pointerEvents = "auto";
}, 3000);

window.onload = resetGame();
window.onLoad = body.style.transition = "4s ease";

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

//experimental detonate features --jQuery starts here

// $( document ).click(function() {
//     $( ".container" ).toggle("explode", {pieces: 8}, 1500 );
// });
