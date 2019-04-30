var fbKey = "AIzaSyChz5y9l2HLc7BpjOxXQAt3R1mjSH0tA3A";
var marvelPublicCode = "9c9ee8837ea5626e53f61a1af4ddf211";

//these variables are for the game logic

var playerName;
var playerKey;
var playerClicks;

var playerTeam;

var initialHealth = 10;
var defaultHost = "no-host-entered";

var gameState = "initial";
var gameHost = defaultHost;
var gameHeroName;

var gameHeroes = [];
var gameConnections = [];

var teamHealth1;
var teamHero1;

var teamHealth2;
var teamHero2;



//Firebae variables
var database;
var gameRef;
var chatRef;
var connectionsRef;
var connectedRef;

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

database = firebase.database();
console.log(database);

gameRef = database.ref("/game");
connectionsRef = database.ref("connections");
connectedRef = database.ref(".info/connected");


connectedRef.on("value", function (snapshot) {
    // If they are connected..
    if (snapshot.val()) {

        // Add user to the connections list.
        playerKey = connectionsRef.push(true);

        // chatRef.set({
        //     chat: screenName + " has joined the chat!",
        //     sender: "System"
        // });

        // Remove user from the connection list when they disconnect.
        playerKey.onDisconnect().remove();

        // for (key in playerKey){
        //     console.log(key);
        // }

        console.log("Connection id: " + playerKey);
        console.log("Type: " + playerKey.key);
    }
}, function (errorObject) {
    console.log(errorObject.code);
});

connectionsRef.on("value", function (snapshot) {
    if ((gameState === "initial")) {
        var teamCount = 0;
        var childKeys = [];



        console.log(snapshot.child);
        snapshot.forEach(function (child) {
            childKeys.push(child.key);
            teamSet = (teamCount % 2) + 1;
            database.ref("/connections/" + child.key).set({
                team: teamSet
            });

            if (child.key === playerKey.key) {
                playerTeam = teamSet;
            }
            teamCount++;
        });

        if (!(childKeys.includes(gameHost)) && (gameHost !== defaultHost)) {
            updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, childKeys[0], gameState);
        }
    }
});

//game ref
//update hostId here upon game value changes
//Handle when hero health is below zero (change state to done)
//If either team health is 0, change game state to end
//Then update()
gameRef.on("value", function (snapshot) {
    gameState = snapshot.val().gameState;
    gameHost = snapshot.val().host;
    teamHero1 = snapshot.val().hero1;
    teamHero2 = snapshot.val().hero2;
    teamHealth1 = snapshot.val().health1;
    teamHealth2 = snapshot.val().health2;

    if ((playerKey.key === gameHost) && (gameState === "initial")) {
        //Make start button visible
    }

    if (gameState === "fight") {
        if ((teamHealth1 <= 0) || (teamHealth2 <= 0)) {
            gameState = "initial";
            updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
            //Need to set game back to initial state
            //Soft reset function
        }
    }
})

function checkGame() {
    console.log("Health 1:" + teamHealth1);
    console.log("Health 2:" + teamHealth2);
    console.log("Team:" + playerTeam);
}

function resetGame() {

    gameState = "initial";

    playerClicks = 0;

    teamHealth1 = 10;
    teamHero1 = "";

    teamHealth2 = 10;
    teamHero2 = "";

    gameHost = defaultHost;

    gameUser = "";
    gameKey = "";
    gameClicks = 0;

    updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
}


function setName(name) {
    if (gameState === "start") {
        playerName = name;
        console.log("Name set: " + name);
        //set user name
        //push connection/user info to server
    }
}


function updateGameDb(health1, health2, hero1, hero2, host, state) {
    //Updates DB with who is host and other game values
    gameRef.set({
        health1: health1,
        health2: health2,
        hero1: hero1,
        hero2: hero2,
        host: host,
        gameState: state
    })
}

function attackButton() {
    if (gameState === "fight") {
        if (gameHealth > 0) {
            gameHealth--;
        }
    }
}


function startButton() {

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

function attackTeam1() {
    teamHealth1--;
}


function attackTeam2() {
    teamHealth2--;
}

function prepFight() {
    updateGameDb(initialHealth, initialHealth, teamHero1, teamHero2, gameHost, gameState);
}

$("#btn-team-1").on("click", function () {
    if ((gameState === "fight") && (teamHealth1 > 0) && (playerTeam === 1)) {
        attackTeam1();
        playerClicks++;
        console.log("Attacked Team 1 (Health: " + teamHealth1 + ")");
        updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
    }

});

$("#btn-team-2").on("click", function () {
    if ((gameState === "fight") && (teamHealth2 > 0) && (playerTeam === 2)) {
        attackTeam2();
        playerClicks++;
        console.log("Attacked Team 2 (Health: " + teamHealth2 + ")");
        updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
    }


});

$("#submit-username").on("click", function (event) {
    event.preventDefault();
    if (gameState === "initial") {

        setName($("#username-input").val().trim());
        $("#username-input").val("");

        if (gameHost === defaultHost) {
            gameHost = playerKey.key;
        }

        // gameState = "fight";
        updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
    }
})

$(document).ready(function () {
    // resetGame();
});

$("#check-button").on("click", function () {
    checkGame();
    send();
});

$("#reset-button").on("click", function () {
    resetGame();
});

$("#start-button").on("click", function () {
    if (gameState === "initial" && playerKey.key === gameHost) {
        //begin timer for fight phase
        //wait
        //choose hero
        //set game values
        //update server game values
        //start timer for fight phase
        console.log("Preparing to fight...");
        prepFight();
        setTimeout(function () { console.log("FIGHT!"); gameState = "fight"; }, 3000);
    }
});


//test
//Calls API function (check console)
//send();

//Testing Marvel Character calls

function send() {

    var spUrl = "http://gateway.marvel.com:443/v1/public/characters?orderBy=name&limit=100&apikey=" + marvelPublicCode;
    var thorUrl = "https://gateway.marvel.com:443/v1/public/characters?name=Thor&apikey=" + marvelPublicCode;
    var vultureUrl = "https://gateway.marvel.com:443/v1/public/characters?name=Vulture&apikey=" + marvelPublicCode;

    $.ajax({
        url: spUrl,
        method: "GET"

    }).then(function (response) {
        console.log("Testing Character List: " + response);

        for (key in response) {
            console.log(key);
        }
    });

    $.ajax({
        url: thorUrl,
        method: "GET"

    }).then(function (response) {
        console.log("Testing Thor URL: " + response);
    });

    // $.ajax({
    //     url: vultureUrl,
    //     method: "GET"

    // }).then(function (response) {
    //     console.log("Testing Vulture URL: " + response);
    // });
}
