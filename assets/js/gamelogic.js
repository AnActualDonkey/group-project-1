var superHeroCode = "384939068772291";
var marvelPublicCode = "9c9ee8837ea5626e53f61a1af4ddf211";
var marvelPrivateCode = "9db81123b9e0468057cbf6012e17f9d53bf811d0";
var flickrCode = "bd21b96440233c2b507b7ec450da5ec1";

var gameHealth;
var gameUser;
var gameKey;
var gameHost;
var gameHeroName;
var gameHeroes = [];
var gameState;
var gameClicks;

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

function send() {
    //URL for SuperHero DB (not working)
    //https://superheroapi.com/api/384939068772291/character-id
    //https://superheroapi.com/api/384939068772291/character-id/powerstats

    //URL for Marvel
    // https://gateway.marvel.com:443/v1/public/characters?apikey=

    //Flickr URLs
    // https://api.flickr.com/services
    // https://api.flickr.com/services/rest/?method=flickr.test.echo&name=value

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