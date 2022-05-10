let ships = '{ "ships": [' +
'{"name": "Drake", "icon": "https://jmonje321.github.io/AzurLaneSecretaries/Images/DrakeIcon.png"},' +
'{"name": "Dunkerque", "icon": "https://jmonje321.github.io/AzurLaneSecretaries/Images/DunkerqueIcon.png"},' +
'{"name": "Monarch", "icon": "https://jmonje321.github.io/AzurLaneSecretaries/Images/MonarchIcon.png"}]}';

let modal = document.getElementById("dock-modal");
let dock = document.getElementById("dock");
let closeButton = document.getElementById("close-modal");

dock.onclick = function() 
{
    modal.style.display = "block";
    getShipIcons();
}

closeButton.onclick = function()
{
    modal.style.display = "none";
}

window.addEventListener("click", function(event)
{
    if(event.target == modal)
    {
        modal.style.display = "none";
    }
})

function timeUntilReset()
{
    const d = new Date();
    let day = d.getDay();
    if(day !== 0)
    {
        day = 7 - day;
    }
    const hour = (23 - d.getHours()) + (24 * day);
    const minutes = 59 - d.getMinutes();
    const seconds = 59 - d.getSeconds();
    
    document.getElementById("reset-time").innerHTML = hour + ":" + addExtraZero(minutes) + ":" + addExtraZero(seconds);
    setTimeout(timeUntilReset, 1000);
}

function addExtraZero(time)
{
    if(time < 10)
    {
        return "0" + time;
    }
    return time;
}

function Ship(name, image)
{
    this.name = name;
    this.image = image;
}

const iconInModal = [];
const shipArr = [];

async function fetchArr() {
    try {
        const response = await fetch('https://jmonje321.github.io/AzurLaneSecretaries/ships.json', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const arr = await response.json();
        return arr;
    } catch (error) {
        console.error(error);
    }
}

async function test()
{
    const arr = await fetchArr();
    console.log(arr.ships[0].icon);

    for(let i = 0; i < arr.ships.length; i++)
    {
        iconInModal.push(arr.ships[i]);
    }
}
test();

/*
var obj;

fetch('https://jmonje321.github.io/AzurLaneSecretaries/ships.json')
  .then(res => res.json())
  .then(data => obj = data)
  .then(() => console.log(obj))


fetch('https://jmonje321.github.io/AzurLaneSecretaries/ships.json')
  .then(response => response.json())
  .then(result => {
    jsonFileData = result;
  });
  //.then(data => console.log(data));


let shipsObj = JSON.parse(ships);
console.log(shipsObj.ships[0].icon);
for(let x = 0; x < shipsObj.ships.length; x++)
{
    iconInModal.push(shipsObj.ships[x]);
}
*/
//console.log(obj);

function getShipIcons()
{
    for(let i = 0; i < iconInModal.length; i++)
    {
        let image = `<image src='${iconInModal[i].icon}' alt='ship'>`;
        console.log(image);
        document.getElementById("shipIcons").innerHTML += image;
    }
}