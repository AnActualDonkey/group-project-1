//https://superheroapi.com/api/384939068772291/character-id
//https://superheroapi.com/api/384939068772291/character-id/powerstats


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

function send() {
    var urlvariable;

    urlvariable = "Character ID";

    var ItemJSON;

    ItemJSON = '[{"Full Name"}]';

    URL = "https://testrestapi.com/additems?var=" + urlvariable; "https://superheroapi.com/api/384939068772291/character-id"


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", URL, false);
    xmlhttp.setRequestHeader("Superhero API", "superheroapi.json");
    xmlhttp.setRequestHeader('Authorization', 'Basic ' + window.btoa('384939068772291'));
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);
    alert(xmlhttp.responseText);
    document.getElementById("#gamearea").innerHTML = xmlhttp.statusText + ":" + xmlhttp.status + "<textarea rows='100' cols='100'>" + xmlhttp.responseText + "</textarea>";
}

function callbackFunction(xmlhttp) {
    //alert(xmlhttp.responseXML);

}