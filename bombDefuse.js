let score = 0;
let lives = 2;
let difficulty = 6;
let colors = generateColors(difficulty);
let pickedColor = randomColor();
const wires = document.querySelectorAll(".wire");
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
const scoreScreen = document.querySelector("#scoreScreen");
const playAgain = document.querySelector("#play-again");
let displayContent = [];
let isMobileViewport = false;
const helpBtn = document.querySelector("#help");
const instructions = document.querySelector("#instructions");
const instructionsCloseBtn = document.querySelector("#close-instructions-btn");

helpBtn.addEventListener("click", function() {
    instructions.style.display = "block";
})

instructionsCloseBtn.addEventListener("click", function() {
    instructions.style.display = "none";
})

if (document.documentElement.clientWidth < 768) {
    isMobileViewport = true;
}

//color generators 
function random() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g }, ${b})`
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

//======================
//Generic game functions
//======================

function setDifficulty(val) {
    if (difficulty !== val) {
        difficulty = val;
        resetGame();
    }
}

function colorPercentage(color) {
    let values = color.substring(4, color.length - 1).split(", ");
    var percent = values.map(val => Math.round(val / 2.55));
    return `${percent[0]}% red, ${percent[1]}% green, & ${percent[2]}% blue`
}

function resetGame() {
    colors = generateColors(difficulty);
    pickedColor = randomColor();
    pickedColorDisplay.textContent = colorPercentage(pickedColor);
    wires.forEach(function (wire) {
        wire.style.display = "none";
    });
    resetDisplay();
    resetIdleLED();
    timedFunctionClear()
    updateLives();
    newGame();
}

function newGame() {
    for (let i = 0; i < difficulty; i++) {
        wires[i].style.display = "block";
        wires[i].style.borderColor = colors[i];
        wires[i].addEventListener("click", check);
        wires[i].addEventListener("click", pliersCut)
    }
    enableButtons();
};

function correct() {
    defusal();
    lives = 2;
    pickedBackgroundColor();
    pliersCut();
    //remove interactivity on game completion
    for (let i = 0; i < difficulty; i++) {
        wires[i].removeEventListener("click", check);
        wires[i].removeEventListener("click", pliersCut)

    }
    //update score
    score++;
}

function check() {
    disableButtons();
    this.style.display = "none";
    if (this.style.borderColor === pickedColor) {
        correct();
    } else if (lives === 2) {
        lives--;
        updateLives();
        armed();
    } else if (lives === 1) {
        timedFunctionClear();
        lives--;
        updateLives();
        explode();
    }
};

function updateLives() {
    if (lives === 2) {
        document.querySelectorAll(".heart").forEach(function(element) {
            element.classList.remove("lifelost")
        });
    } else if (lives === 1) {
        document.getElementById("heart1").classList.add("lifelost");
    } else {
        document.getElementById("heart2").classList.add("lifelost");
    }
}

//======================
//static event listeners
//======================

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

//================================
// Background Colour functionality
//================================

function pickedBackgroundColor() {
    document.querySelector("body").style.backgroundColor = pickedColor;
}

body.style.backgroundColor = random();

//Not necessary. Allows me to work from a Live Server without transistion of body margin when CSS is updated. 
// Can safely be removed once added to CSS.
window.onLoad = body.style.transition = "4s ease";

//========================
//LCD screen interactivity
//========================

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
    for (let i = 0; i < 10; i++) {
        bombNumber[i].addEventListener("click", numButton);
    };
    clearDisplay.addEventListener("click", resetDisplay);
    backspace.addEventListener("click", backspaceButton);
};

function disableButtons() {
    for (let i = 0; i < 10; i++) {
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
    display.textContent = display.textContent == "press" ? "reset" : "press";
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

//===========
//game states
//===========

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
}

function explode() {
    // --jQuery used for animation effects
    $(".bomb").hide();
    $(".explosion").fadeIn();
    $("#wrapper").fadeOut();
    $("#help").fadeOut();
    $(".health").fadeOut();
    //Game Over screen
    if (score === 0) {
        scoreScreen.textContent = "You failed to defuse the bomb.";
    }
    else if (score > 1) {
        scoreScreen.textContent = "You defused " + score + " bombs.";
    }
    else {
        scoreScreen.textContent = "You defused " + score + " bomb.";
    }
    setTimeout(function () {
        $("#gameover").fadeIn();       
    }, 1500);
};

//countdown timer

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

//==============================================
//scaling bomb size based on client width/height
//==============================================

function bombScale() {
    if (isMobileViewport) {
        return;
    }

    const bomb = document.querySelector(".bomb");
    let docHeight = document.querySelector("*").clientHeight;
    let docWidth = document.querySelector("*").clientWidth;
    let wrapperHeight = document.querySelector("#wrapper").clientHeight * 3;

    //these are the hard coded px height and width that the bomb was initially drawn in
    const heightOfBomb = 945;
    const widthOfBomb = 680;

    let scaleWidth = (docWidth - 20) / widthOfBomb;
    let heightOfBombSpace = docHeight - wrapperHeight;
    let scaleHeight = heightOfBombSpace / heightOfBomb;

    bomb.style.transform = "translate(-50%, -50%) scale(" + Math.min(scaleWidth, scaleHeight) + ")";
}

//bomb adjusts to client window on page load (once all assests are ready) and resize 
window.onload = bombScale;
window.onresize = bombScale;

//run on startup
$("document").ready(resetGame);