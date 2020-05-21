const scoresList = document.querySelector("#scores-list")
const scoreTable = document.querySelector(".nes-table-responsive");
const playerNameSubmit = document.querySelector("#playerNameSubmit");
const playerName = document.getElementById("playerName");
const nameField = document.getElementById("name_field");
const promptWindow = document.getElementById("submission-prompt");

var firebaseConfig = {
    apiKey: "AIzaSyBRQXLJhLjp7PJABu3zaYFTursa_4L7hxQ",
    authDomain: "bombdefuse-14d88.firebaseapp.com",
    databaseURL: "https://bombdefuse-14d88.firebaseio.com",
    projectId: "bombdefuse-14d88",
    storageBucket: "bombdefuse-14d88.appspot.com",
    messagingSenderId: "379527478626",
    appId: "1:379527478626:web:e85494b960d5d3c91d403b",
    measurementId: "G-RYJDVZTNFW",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

// firebase interations 

function renderScores(doc) {
    let tr = document.createElement("tr");
    let name = document.createElement("td");
    let playerScore = document.createElement("td");

    //set attribute to individual element to identify it
    tr.setAttribute("data-id", doc.id)
    name.textContent = doc.data().name;
    playerScore.textContent = doc.data().score;

    tr.appendChild(name);
    tr.appendChild(playerScore);

    scoresList.appendChild(tr);
}

function renderError() {
    const errorReport = document.querySelector("#error-report");

    errorReport.style.display = "block";
    scoreTable.style.display = "none";
    nameField.disabled = true;
}

let collection;

// this is not working due to the way difficulty currently works
function defineCollection() {
    const h3 = document.querySelector("#gameover h3");

    if (difficulty === 3) {
        collection = "highScoresEasy";
        h3.innerHTML = 'Mode: <span class="nes-text is-success">EASY</span>';
    } else
    if (difficulty === 6) {
        collection = "highScores";
        h3.innerHTML = 'Mode: <span class="nes-text is-warning">NORMAL</span>';
    } else
    if (difficulty === 9) {
        collection = "highScoresHard";
        h3.innerHTML = 'Mode: <span class="nes-text is-error">HARD</span>';
    }
}

defineCollection();
renderHighScoreTable(collection);

let scoreToBeat;

function renderHighScoreTable(collection) {
    //returns promise of high scores in descending order limited to 3
database.collection(collection).orderBy("score", "desc").limit(3).get().then(function(querySnapshot) {    
    querySnapshot.forEach(function(doc) {
        renderScores(doc);
        //sets up a score to beat that allows the pushing of a score to the server (stops too many submissions)
        scoreToBeat = doc.data().score;
    })
}).catch(function(error) {
    console.log(error)
    // will display error screen
    renderError();
});
}

function removeHighScoreTable() {
    while (scoresList.firstChild) {
        scoresList.removeChild(scoresList.firstChild);
    }
}

function databaseAddSuccess() {
    //disable submit button
    playerNameSubmit.disabled = true;
    playerNameSubmit.classList.remove("is-success")
    playerNameSubmit.classList.add("is-disabled")

    //disable name field 
    nameField.disabled = true;
    nameField.classList.remove("is-success")
    nameField.classList.remove("is-error")

    //show the prompt window
    $("#submission-prompt").fadeIn().delay(1500).fadeOut();
    $("#submission-prompt p").html('Your score has been <span class="nes-text is-success">saved!')
}

function databaseAddError(error) {
    $("#submission-prompt").fadeIn().delay(1500).fadeOut();
    $("#submission-prompt p").html('<span class="nes-text is-error">Failed</span> saving score! err: ' + error)
}

function submitHighScore(collection) {
    database.collection(collection).add({
        name: nameField.value,
        score: score
    }).then(
        databaseAddSuccess()
    ).catch((error) => {
        databaseAddError(error)
    })
}

playerNameSubmit.addEventListener("click", () => {
    //this is to stop my db getting spammed with scores
    if (score > scoreToBeat) {
        submitHighScore(collection);
    }
    else {
        databaseAddSuccess();
    }
})

playerName.addEventListener("input", () => {
    checkInput();
})

function checkInput() {
    var input = nameField.value;

    if (input.length === 0) {
        inputEmpty();
    } else 
    if (input.length < 3 || input.length > 8) {
        inputValidationError();
    } else 
    if (input.length >= 3 && input.length <= 8) {
        if (input.search(/[^A-Za-z0-9]+/) == -1) {
            inputValidationSuccess();
        } 
        else {
            inputValidationError()
        } 
    }
}

function inputValidationError() {
    nameField.classList.remove("is-success");
    nameField.classList.add("is-error")

    playerNameSubmit.disabled = true;
    playerNameSubmit.classList.remove("is-success")
    playerNameSubmit.classList.add("is-disabled")
}

function inputValidationSuccess() {
    nameField.classList.add("is-success");
    nameField.classList.remove("is-error")

    playerNameSubmit.disabled = false;
    playerNameSubmit.classList.add("is-success")
    playerNameSubmit.classList.remove("is-disabled")
}

function inputEmpty() {
    nameField.classList.remove("is-success")
    nameField.classList.remove("is-error")

    playerNameSubmit.disabled = true;
    playerNameSubmit.classList.remove("is-success")
    playerNameSubmit.classList.add("is-disabled")
}
