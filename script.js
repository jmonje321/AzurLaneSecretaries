let ships = '{ "ships": [' +
'{"name": "Drake", "icon": "https://azurlane.netojuu.com/w/images/thumb/d/da/DrakeIcon.png/90px-DrakeIcon.png"},' +
'{"name": "Dunkerque", "icon": "https://azurlane.netojuu.com/w/images/thumb/2/26/DunkerqueIcon.png/90px-DunkerqueIcon.png"},' +
'{"name": "Monarch", "icon": "https://azurlane.netojuu.com/w/images/thumb/a/a3/MonarchIcon.png/90px-MonarchIcon.png"}]}';

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

fetch('ships.json')
  .then(response => response.json())
  .then(data => console.log(data));

let shipsObj = JSON.parse(ships);
console.log(shipsObj.ships[0].icon);
for(let x = 0; x < shipsObj.ships.length; x++)
{
    iconInModal.push(shipsObj.ships[x]);
}

function getShipIcons()
{
    for(let i = 0; i < iconInModal.length; i++)
    {
        let image = `<image src='${iconInModal[i].icon}' alt='ship'>`;
        console.log(image);
        document.getElementById("shipIcons").innerHTML += image;
    }
}