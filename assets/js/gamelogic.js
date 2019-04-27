var fbKey = "AIzaSyChz5y9l2HLc7BpjOxXQAt3R1mjSH0tA3A";
var marvelPublicCode = "9c9ee8837ea5626e53f61a1af4ddf211";

//these variables are for the game logic
var gameHealth;
var gameUser;
var gameKey;
var gameHost;
var gameHeroName;
var gameHeroes = [];
var gameState;
var gameClicks;


//Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: fbKey,
    authDomain: "hero-project-b444a.firebaseapp.com",
    databaseURL: "https://hero-project-b444a.firebaseio.com",
    projectId: "hero-project-b444a",
    storageBucket: "hero-project-b444a.appspot.com",
    messagingSenderId: "484835274167"
};
firebase.initializeApp(config);

//game ref
//update hostId here upon game value changes
//Handle when hero health is below zero (change state to done)


function resetGame() {
    gameState = "start";
    gameHealth = 0;
    gameUser = "";
    gameKey = "";
    gameClicks = 0;
}


function setName() {
    if (gameState === "start") {

        //set user name
        //push connection/user info to server
    }
}


function updateGameDb() {
    //Updates DB with who is host and other game values
}

function attackButton() {
    if (gameState === "fight") {
        if (gameHealth > 0) {
            gameHealth--;
        }
    }
}


function startButton() {
    if (gameState === "start" && gameKey === gameHost) {

        //begin timer for fight phase
        //wait
        //choose hero
        //set game values
        //update server game values
        //start timer for fight phase
        gameState = "fight";
    }
}

function send() {//URL for Marvel
    // https://gateway.marvel.com:443/v1/public/characters?apikey=

    var queryUrl = "https://gateway.marvel.com:443/v1/public/characters?apikey=" + marvelPublicCode;

    $.ajax({
        url: queryUrl,
        method: "GET"

    }).then(function (response) {
        console.log(response);
    });

}


//test
//Calls API function (check console)
send();