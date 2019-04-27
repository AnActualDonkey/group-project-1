var testVar = 6;
var myVar = 9;

console.log(testVar + myVar);




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

function resetGame(){
    gameState = "start";
    gameHealth = 0;
    gameUser = "";
    gameKey = "";
    gameClicks = 0;
}


function setName(){
    if(gameState === "start"){

        //set user name
        //push connection/user info to server
    }
}

function updateGameDb(){
    //Updates DB with who is host and other game values
}

function attackButton(){
    if(gameState === "fight"){
        if(gameHealth > 0){
            gameHealth--;
        }
    }
}

function startButton(){
    if(gameState === "start" && gameKey === gameHost){
        //begin timer for fight phase
        //wait
        //choose hero
        //set game values
        //update server game values
        //start timer for fight phase
        gameState = "fight";
    }
}