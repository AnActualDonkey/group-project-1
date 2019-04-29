var fbKey = "AIzaSyChz5y9l2HLc7BpjOxXQAt3R1mjSH0tA3A";
var marvelPublicCode = "9c9ee8837ea5626e53f61a1af4ddf211";

//these variables are for the game logic

var playerName;
var playerKey;
var playerClicks;

var gameState;
var gameHost;
var gameHeroes = [];
var gameConnections = [];

var teamHealth1;
var teamHero1;

var teamHealth2;
var teamHero2;


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
    
    teamHealth1 = 1000;
    teamHero1 = "";
    
    teamHealth2 = 1000;
    teamHero2 = "";

    gameUser = "";
    gameKey = "";
    gameClicks = 0;
}


function setName(name) {
    if (gameState === "start") {
        playerName = name;
        console.log("Name set: " + name);
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

function attackTeam1(){
    teamHealth1--;
}


$("#btn-team1").on("click", function(){
    attackTeam1();
    console.log("Attacked Team 1 (Health: " + teamHealth1 + ")");
});

$("#submit-username").on("click", function(event){
    event.preventDefault();
    setName($("#username-input").val().trim());
    $("#username-input").val("");
})

$(document).ready(function(){
    resetGame();
});

//test
//Calls API function (check console)
send();