var difficulty = 6;
var colors = generateColors(difficulty);
var pickedColor = randomColor();
var squares = document.querySelectorAll(".wire");
var easy = document.querySelector("#easy");
var medium = document.querySelector("#medium");
var hard = document.querySelector("#hard");
var reset = document.querySelector("#reset");
var pickedColorDisplay = document.querySelector("#goal");
var bombButton = document.querySelectorAll(".bomb-button");
var bombNumber = document.querySelectorAll(".bomb-number");
var display = document.querySelector("#calc-display");
var clearDisplay = document.querySelector("#clear");
var backspace = document.querySelector("#backspace");
var LED = document.querySelector(".LED");
var LEDarmed = document.querySelector("#armed");
var body = document.querySelector("body");
var help = document.querySelector(".help");
var tooltip = document.querySelector("p");
var farewell = ["goodbye", "ciao", "gd gosh", "bye", "ouch", "bang", "tally ho", "oof", "oh jeez"]
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
    colors = generateColors(difficulty);
    pickedColor = randomColor();
    pickedColorDisplay.textContent = pickedColor;
    for (let i = 0; i < 9; i++) {
        squares[i].style.display = "none";
    }
    resetDisplay();
    resetIdleLED();
    timedFunctionClear()
    newGame();
}

function newGame() {
    for (let i = 0; i < difficulty; i++) {
        squares[i].style.display = "block";
        squares[i].style.borderColor = colors[i];
        squares[i].addEventListener("click", check)
    }
    enableButtons();
    generateRainbowText(pickedColorDisplay);
};

function correct() {
    defusal();
    pickedBackgroundColor();
    //remove interactivity on game completion
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check)
    }
}

function check() {
    disableButtons();
    this.style.display = "none";
    if (this.style.borderColor === pickedColor) {
        correct();
    } else {
        armed();
    }
};

//static event listeners

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

//bomb keypad button interactivity

function enableButtons() {
    for (let i = 0; i < bombNumber.length; i++) {
        bombNumber[i].addEventListener("click", numButton);
    };
    clearDisplay.addEventListener("click", resetDisplay);
    backspace.addEventListener("click", backspaceButton);
};

function disableButtons() {
    for (let i = 0; i < bombButton.length; i++) {
        bombButton[i].removeEventListener("click", numButton);
    };
    clearDisplay.removeEventListener("click", resetDisplay);
    backspace.removeEventListener("click", backspaceButton);
};

function numButton() {
    if (display.textContent.length < 8) {
        displayContent.push(this.textContent);
    }
    displayContentUpdate();
};

function backspaceButton() {
    if (displayContent.length > 1) {
        displayContent.pop();
        displayContentUpdate();
    }
    else {
        displayContent.pop();
        display.textContent = 0;
    }
};

//LCD dynamic text

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
    LEDarmed.classList.remove("armed")
    LED.classList.add("LED-idle");
    document.querySelector("#reset div").classList.remove("alert");
}

//game states

function defusal() {
    LED.classList.remove("LED-idle", "LED-incorrect")
    LEDarmed.classList.remove("armed");
    LED.classList.add("LED-correct");
    //disables countdown and detonation
    timedFunctionClear();
    display.textContent = "defused";
    //make reset button flash
    document.querySelector("#reset div").classList.add("alert");
    //LCD display text
    id = setInterval(blinkingText, 1200);
}

let myTimeoutID;

function armed() {
    LED.classList.remove("LED-idle");
    LED.classList.add("LED-incorrect");
    LEDarmed.classList.add("armed");
    display.textContent = "error";
    //grace period before countdown begins
    myTimeoutID = setTimeout(timer, 1000)
    //replace check with detonateCheck
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check);        
        squares[i].addEventListener("click", finalCheck);        
    }
}

function finalCheck() {
    this.style.display = "none";
    if (this.style.borderColor === pickedColor) {
        correct();
    } else {
        timedFunctionClear();
        //display random message (easter egg)
        display.textContent = farewell[Math.floor(Math.random()*farewell.length)];
        explode();
    }
    //remove finalCheck 
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", finalCheck);        
    }
};

function explode() {
    // --jQuery used for animation effects
    $(".container").effect("explode", { pieces: 9 }, 1500);
    $("#wrapper").slideUp();
    $(".help").fadeOut();
    //ditch this for Game Over screen
    setTimeout(refresh, 2000);
};

//ditch this
function refresh() {
    location.reload();
};

//countdown timers

let myCountdownID;

function timedFunctionClear() {
    clearTimeout(myTimeoutID);
    clearInterval(myCountdownID);
}

function timer() {
    //once this is triggered, disable armed(), call detonate()

    let second = difficulty;
    let decisecond = 0;
    let centisecond = 0;

    myCountdownID = setInterval(function () {
        display.textContent = '0' + second + ":" + decisecond + centisecond;
        centisecond--;
        if (centisecond < 0) {
            centisecond = 9;
            decisecond--;
            if (decisecond < 0) {
                decisecond = 9
                second--;
                if (second < 0) {
                    clearInterval(myCountdownID);
                    explode();
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
};
