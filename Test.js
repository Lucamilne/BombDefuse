var difficulty = 6;
var colors = generateColors(difficulty);
var pickedColor = randomColor();
var squares = document.querySelectorAll(".wire");
var easy = document.querySelector("#easy");
var medium = document.querySelector("#medium");
var hard = document.querySelector("#hard");
var message = document.querySelector("#message");
var pickedColorDisplay = document.querySelector("#goal");
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
    newGame();
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
            }
        })
    }
};

function correct() {
    for (let i = 0; i < difficulty; i++) {
        squares[i].style.borderColor = pickedColor;
    }
    document.querySelector("h1").style.borderColor = pickedColor;
    message.textContent = "Correct! Play again?"
    reset.textContent = "Choose new colours"
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

reset.addEventListener("click", function () {
    resetGame();
})


resetGame();
