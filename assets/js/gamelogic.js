//https://superheroapi.com/api/384939068772291/character-id
//https://superheroapi.com/api/384939068772291/character-id/powerstats

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