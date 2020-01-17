let score = 0;
let difficulty = 6;
let colors = generateColors(difficulty);
let pickedColor = randomColor();
const squares = document.querySelectorAll(".wire");
const easy = document.querySelector("#easy");
const medium = document.querySelector("#medium");
const hard = document.querySelector("#hard");
const reset = document.querySelector("#reset");
const pickedColorDisplay = document.querySelector("#goal");
const bombButton = document.querySelectorAll(".bomb-button");
const bombNumber = document.querySelectorAll(".bomb-number");
const display = document.querySelector("#calc-display");
const clearDisplay = document.querySelector("#clear");
const backspace = document.querySelector("#backspace");
const LED = document.querySelector(".LED");
const LEDarmed = document.querySelector("#armed");
const body = document.querySelector("body");
const gameover = document.querySelector("#gameover");
const help = document.querySelector(".help");
const tooltip = document.querySelector("p");
const scoreScreen = document.querySelector("#scoreScreen");
const farewell = ["goodbye", "ciao", "gd gosh", "bye", "ouch", "bang", "tally ho", "oof", "oh dear", "fail"]
let displayContent = [];
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
        squares[i].addEventListener("click", check);
        squares[i].addEventListener("click", pliersCut)
    }
    enableButtons();
    generateRainbowText(pickedColorDisplay);
};

function correct() {
    defusal();
    pickedBackgroundColor();
    //remove interactivity on game completion
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check);
        squares[i].removeEventListener("click", pliersCut)

    }
    //update score
    score++;
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

function finalCheck() {
    this.style.display = "none";
    if (this.style.borderColor === pickedColor) {
        correct();
    } else {
        timedFunctionClear();
        //display random message (easter egg)
        display.textContent = farewell[Math.floor(Math.random() * farewell.length)];
        explode();
    }
    //remove finalCheck on wrong guess. Either the game is won or lost at this point
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", finalCheck);
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

gameover.addEventListener("click", function () {
    //reload the page from cache
    location.reload();
});

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
    display.textContent = "false";
    //grace period before countdown begins
    myTimeoutID = setTimeout(timer, 1000)
    //replace check with detonateCheck
    for (let i = 0; i < difficulty; i++) {
        squares[i].removeEventListener("click", check);
        squares[i].addEventListener("click", finalCheck);
    }
}

function explode() {
    // --jQuery used for animation effects
    $(".bomb").hide();
    $(".explosion").fadeIn();
    $("#wrapper").fadeOut();
    $(".help").fadeOut();
    //Game Over screen
    if (score === 0) {
        scoreScreen.textContent = "You failed to defuse the bomb. Play again?";
    }
    else if (score > 1) {
        scoreScreen.textContent = "You defused " + score + " bombs. Play again?";
    }
    else {
        scoreScreen.textContent = "You defused " + score + " bomb. Play again?";
    }
    setTimeout(function () {
        $("#gameover").fadeIn();
    }, 1500);
};

//countdown timers

let myCountdownID;

function timedFunctionClear() {
    clearTimeout(myTimeoutID);
    clearInterval(myCountdownID);
}

function timer() {
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

//disables help until initial animation is complete
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

//pliers

function pliersCut() {
    let pliers = document.querySelector("#pliers");
    let x, y;

    x = event.pageX;
    y = event.pageY;
    //plays the cutting animation based on the click location
    pliers.style.display = "block"
    pliers.style.left = x + "px";
    pliers.style.top = y + "px";
    // fade out the pliers 150ms into animation
    setTimeout(function () {
        $("#pliers").fadeOut();
    }, 150);
};

//experimental scaling

function bombScale(event) {
    const bomb = document.querySelector(".bomb");
    let docHeight = document.querySelector("*").clientHeight;
    let docWidth = document.querySelector("*").clientWidth;
    let wrapperHeight = document.querySelector("#wrapper").clientHeight * 2.5;

    const heightOfBomb = 945;
    const widthOfBomb = 680;

    let scaleWidth = (docWidth - 20) / widthOfBomb;
    let heightOfBombSpace = docHeight - wrapperHeight;
    let scaleHeight = heightOfBombSpace / heightOfBomb;

    bomb.style.transform = "translate(-50%, -50%) scale(" + Math.min(scaleWidth, scaleHeight) + ")"

    // if (docWidth < widthOfBomb) {
    //     console.log("width f " + scaleWidth + " doc height: " + docHeight + "doc width " + docWidth);
    //     bomb.style.transform = "translate(-50%, -50%) scale(" + scaleWidth + ")"
    // }
    // else {
    //     bomb.style.transform = "translate(-50%, -50%) scale(" + scaleHeight + ")"
    // }
}

window.onload = bombScale;
window.onresize = bombScale;