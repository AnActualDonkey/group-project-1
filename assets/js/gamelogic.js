var fbKey = "AIzaSyChz5y9l2HLc7BpjOxXQAt3R1mjSH0tA3A";
var marvelPublicCode = "9c9ee8837ea5626e53f61a1af4ddf211";

//Hero class
class Hero {
    constructor(id, name, bio, thumb, image, moving, stopped) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.thumb = thumb;
        this.image = image;
        this.moving = moving;
        this.stopped = stopped;
    }
}

//Pair class
class Pair {
    constructor(good, bad) {
        this.good = good;
        this.bad = bad;
    }
}

//these variables are for the game logic

var playerName = "default-name";
var playerKey;
var playerClicks = 0;

var playerTeam;

var initialHealth = 25;
var defaultHost = "no-host-entered";

var gameState = "initial";
var gameHost = defaultHost;
var gameHeroName;

var gameHeroes = [];
var gameConnections = [];
var gamePlayers;
var gameTopClicks = 0;
var gameTopClicker = "nobody";
var gameCharacters = ["Spider-Man", "Thor", "Hulk", "Wolverine", "Ultron", "Thanos"];

var teamHealth1;
var teamHero1;

var teamHealth2;
var teamHero2;

//  constructor(id, name, bio, thumb, image, moving, stopped)
var heroTest = new Hero(1, "Thor", "He is a thunder and lightning guy", "thumb", "image", "moving", "stopped");

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
controlRef = database.ref("control");
connectedRef = database.ref(".info/connected");
clicksRef = database.ref("/clicks");
topRef = database.ref("/top");
chatRef = database.ref("/chat");

topRef.on("value", function(snapshot){
    gameTopClicks = snapshot.val().clicks;
    gameTopClicker = snapshot.val().name;
    console.log(gameTopClicks + " from " + gameTopClicker + "!");
});

clicksRef.orderByChild("/clicks").limitToLast(1).on("child_added", function(snapshot) {
    // console.log("Highest clicks: " + snapshot.val().clicks);
    var newClicks = snapshot.val().clicks;
    var newName = snapshot.val().name;
    if(newClicks > 0){
        topRef.set({
            clicks: snapshot.val().clicks,
            name: snapshot.val().name
        });
    }
    
    // gameTopClicks = snapshot.val().clicks;
    // gameTopClicker = snapshot.val().name;
});

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
    gamePlayers = snapshot.numChildren();

    if((snapshot.numChildren()) === 1 && (gameState === "initial") && (gameHost === defaultHost)){
        console.log("Game is being reset!");
        resetGame();
    }

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
            console.log("Game reassigning host!");
            updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, childKeys[0], gameState);
        }
        updatePanels();
    }
});

controlRef.on("value", function (snapshot){
    $("#control-message").text(snapshot.val().message);
});

chatRef.on("value", function(snapshot){

    //Keep track of players in the game
    latestChat = snapshot.val().chat;
    latestSender = snapshot.val().sender;
    pushChat(latestSender, latestChat);
    console.log(snapshot.numChildren());
}), function(errorObject){
    console.log(errorObject.code);
};

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
        playerClicks = 0;
        //Make start button visible
    }

    if(gameState === "initial"){
        playerClicks = 0;
        // $("#control-message").text("Waiting for host to start game...");
        // controlRef.set({message: "Waiting for host to start game..."});
    }

    if (gameState === "fight") {
        if (teamHealth1 < 0) {
            gameState = "initial";
            updateGameDb(0, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
            // prepFight();

            database.ref("/clicks").set(true);
            //Need to set game back to initial state
            //Soft reset function

            if(playerKey.key === gameHost){
                chatRef.set({
                    chat: "Team 2 wins!",
                    sender: "System"
                });
                chatRef.set({
                    chat: gameTopClicker + " had the most clicks with " + gameTopClicks + "!",
                    sender: "System"
                });
            }
            controlRef.set({message: "Waiting for host to start game..."});
        }
        if (teamHealth2 < 0) {
            gameState = "initial";
            updateGameDb(teamHealth1, 0, teamHero1, teamHero2, gameHost, gameState);
            // prepFight();


            database.ref("/clicks").set(true);
            //Need to set game back to initial state
            //Soft reset function
            if(playerKey.key === gameHost){
                chatRef.set({
                    chat: "Team 1 wins!",
                    sender: "System"
                });
                chatRef.set({
                    chat: gameTopClicker + " had the most clicks with " + gameTopClicks + "!",
                    sender: "System"
                });
            }
            controlRef.set({message: "Waiting for host to start game..."});
            
        }
    }

    $(".values-1").text("Health: " + teamHealth1);
    $(".values-2").text("Health: " + teamHealth2);

    updatePanels();

    
});

function pushChat(sender, message){
    var newP = $("<p>");
    newP.text(sender + ": " + message);
    $("#chat-box").append(newP);

    $("#chat-input").val("");

    console.log($("#chat-box")[0].scrollTop);
    $("#chat-box")[0].scrollTop = $("#chat-box")[0].scrollHeight;
}

function updatePanels(){
    $("#control-team").text("Team: " + playerTeam);

    if(playerKey.key === gameHost){
        $("#control-name").text("Name: " + playerName + " (host)");
    } else {
        $("#control-name").text("Name: " + playerName);
    }
    

    $("#control-clicks").text("Clicks: " + playerClicks);
    $("#control-players").text("Players: " + gamePlayers);

    $("#health-bar-1").attr("style", "width: " + (teamHealth1/initialHealth)*100 + "%");
    $("#health-bar-2").attr("style", "width: " + (teamHealth2/initialHealth)*100 + "%");
}

function createHeroBox(hero, team){
    var card = $("<div>").addClass("card");
    
    var cardHead = $("<div>").addClass("card-header hero-header");
    // var cardHead = $("<div>").addClass("hero-header");

    var cardBody = $("<div>").addClass("card-body hero-body");
    // var cardBody = $("<div>").addClass("hero-body");

    cardHead.text(hero.name);
    cardBody.text(hero.bio);

    card.append(cardHead);
    card.append(cardBody);
    $(".hero-box-" + team).append(card);
}

function checkGame() {
    console.log("Health 1:" + teamHealth1);
    console.log("Health 2:" + teamHealth2);
    console.log("Team:" + playerTeam);
}

function resetGame() {

    gameState = "initial";

    playerClicks = 0;

    teamHealth1 = initialHealth;
    teamHero1 = "";

    teamHealth2 = initialHealth;
    teamHero2 = "";

    gameHost = defaultHost;

    gameUser = "";
    gameKey = "";
    gameClicks = 0;

    updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
    controlRef.set({message: "Waiting for host to start game..."});
}


function setName(name) {
    if (gameState === "initial") {
        playerName = name;
        console.log("Name set: " + name);
        //set user name
        //push connection/user i nfo to server
        // database.ref("/connections/" + playerKey.key).set({
        //     team: teamSet,
        //     name: playerName,
        //     clicks: playerClicks
        // });
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
    if ((gameState === "fight") && (teamHealth1 >= 0) && (playerTeam === 1)) {
        attackTeam1();
        playerClicks++;
        console.log("Attacked Team 1 (Health: " + teamHealth1 + ")");
        updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
        database.ref("/clicks").push({
            name: playerName,
            clicks: playerClicks,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    }

});

$("#btn-team-2").on("click", function () {
    if ((gameState === "fight") && (teamHealth2 >= 0) && (playerTeam === 2)) {
        attackTeam2();
        playerClicks++;
        console.log("Attacked Team 2 (Health: " + teamHealth2 + ")");
        updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
        database.ref("/clicks").push({
            name: playerName,
            clicks: playerClicks,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
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
        updatePanels();
    }
});

$("#submit-chat").on("click", function(event){
    event.preventDefault();
    var text = $("#chat-input").val().trim();
    
    if(text === "hero check 1"){
        createHeroBox(heroTest, playerTeam);
    }
    

    chatRef.set({
        chat: text,
        sender: playerName
    });
});

$(document).ready(function () {
    // resetGame();
});

$("#check-button").on("click", function () {
    checkGame();
    // grabGifs(gameCharacters[0]);
    for(var i = 0; i < gameCharacters.length; i++){
        makeHeroObject(gameCharacters[i]);
    }

    for(var j = 0; j < gameHeroes.length; j++){
        console.log(gameHeroes[i].name);
    }
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
        controlRef.set({message: "Perparing to fight..."});

        // //choose heroes here
        // var heroIndex1 = 

        prepFight();
        setTimeout(function () {
            controlRef.set({message: "FIGHT!!!"});
            gameState = "fight";
            updateGameDb(teamHealth1, teamHealth2, teamHero1, teamHero2, gameHost, gameState);
        }, 3000);
        
    }
});


//test
//Calls API function (check console)
//send();

//Testing Marvel Character calls

function getMarvelHero(heroName){
    var heroUrl = "https://gateway.marvel.com:443/v1/public/characters?name=" + heroName + "&apikey=" + marvelPublicCode;

    var heroResult;

    $.ajax({
        url: heroUrl,
        method: "GET"

    }).then(function (response) {
        // const {id, name, description, thumbnail, path}=response.data.results[0];
        console.log(response);
        console.log("Typecheck: " + typeof response);
        console.log("Testing Spiderman URL: " + response.data.results[0]);
        // for (key in response.data.results) {
        //     console.log(key);
        // }
        console.log(heroName + " ID: " + response.data.results[0].id);
        console.log(heroName + " Name: " + response.data.results[0].name);
        console.log(heroName + " Description: " + response.data.results[0].description);
        console.log(heroName + " Thumbnail: " + response.data.results[0].thumbnail);
        console.log(heroName + " Image: " + response.data.results[0].thumbnail.path);

        heroResult = {
            id: response.data.results[0].id,
            name: response.data.results[0].name,
            bio: response.data.results[0].description,
            image: response.data.results[0].thumbnail + "." + response.data.results[0].thumbnail.path
        };



        
    });

    return(heroResult);
}

function send() {

    getMarvelHero("Spider-Man");
    getMarvelHero("Thor");
    getMarvelHero("Hulk");
    getMarvelHero("Thanos");
    getMarvelHero("Ultron");
    getMarvelHero("Wolverine");
    // getMarvelHero("CaptainAmerica");
    // getMarvelHero("IronMan");
}

// thorHero= {
//     id: ssfdsafslajf,
//     namd: kljflks
// }

// function fillHeroes(){
//     thorHero.id = 1;
// }

function makeHeroObject(heroName){
    // var marvelInfo = getMarvelHero(heroName);
    // var gifInfo = grabGifs(heroName);

    // // constructor(id, name, bio, thumb, image, moving, stopped)
    // // var newHero = new Hero(marvelInfo.id, marvelInfo.name, marvelInfo.bio, "blank", marvelInfo.image, gifInfo.moving, gifInfo.stopped);
    // var newHero = new Hero(1, 1, 1, "blank", marvelInfo.image, gifInfo.moving, gifInfo.stopped);

    // return(newHero);

    var newHero;

    var heroUrl = "https://gateway.marvel.com:443/v1/public/characters?name=" + heroName + "&apikey=" + marvelPublicCode;

    var heroResult;

    $.ajax({
        url: heroUrl,
        method: "GET"

    }).then(function (response) {
        // const {id, name, description, thumbnail, path}=response.data.results[0];
        console.log(response);
        console.log("Typecheck: " + typeof response);
        console.log("Testing Spiderman URL: " + response.data.results[0]);
        
        console.log(heroName + " ID: " + response.data.results[0].id);
        console.log(heroName + " Name: " + response.data.results[0].name);
        console.log(heroName + " Description: " + response.data.results[0].description);
        console.log(heroName + " Thumbnail: " + response.data.results[0].thumbnail);
        console.log(heroName + " Image: " + response.data.results[0].thumbnail.path);

        var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + heroName + "&api_key=xmoCxA5GrmbWp0DeDscuQgiMn1KQt4FW";
        var gifResult;
    
        $.ajax({
            url: giphyURL,
            method: "GET"
        }).done(function(responseG){
            console.log(responseG.data[0].images.original_still.url);
            console.log(responseG.data[0].images.original.url);
    
            heroResult = {
                id: response.data.results[0].id,
                name: response.data.results[0].name,
                bio: response.data.results[0].description,
                image: response.data.results[0].thumbnail + "." + response.data.results[0].thumbnail.path,
                moving: responseG.data[0].images.original.url,
                stopped: responseG.data[0].images.original_still.url
            };
            // gifResult = {
            //     moving: response.data[0].images.original.url,
            //     stopped: response.data[0].images.original_still.url
            // };
    
            gameHeroes.push(heroResult);
            console.log(heroResult);
        });

    });
}


function grabGifs(heroName){

    var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + heroName + "&api_key=xmoCxA5GrmbWp0DeDscuQgiMn1KQt4FW";

    var gifResult;

    $.ajax({
        url: giphyURL,
        method: "GET"
    }).done(function(response){
        console.log(response.data[0].images.original_still.url);
        console.log(response.data[0].images.original.url);

        gifResult = {
            moving: response.data[0].images.original.url,
            stopped: response.data[0].images.original_still.url
        };

        gameHeroes.push
    });
}


