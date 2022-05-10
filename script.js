let modal = document.getElementById("dock-modal");
let dock = document.getElementById("dock");
let closeButton = document.getElementById("close-modal");

dock.onclick = function() 
{
    modal.style.display = "block";
    updateDock();
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

function clickedShipIcon(shipID)
{
    console.log(shipID);
}

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

const iconInModal = [];
const dockArr = [];
let dockHasChanged;

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
        dockArr.push(arr.ships[i]);
    }
    dockHasChanged = false;
    getShipIcons();
}
test();

function getShipIcons()
{
    for(let i = 0; i < dockArr.length; i++)
    {
        let image = `<img class='${dockArr[i].rarity}' src='${dockArr[i].icon}' alt='${dockArr[i].name}' onclick='clickedShipIcon(this.alt)'>`;
        console.log(image);
        document.getElementById("shipIcons").innerHTML += image;
    }
}

function updateDock()
{
    if(dockHasChanged)
    {
        let dockImageElements = document.getElementsByClassName('ships-in-modal');
        for(let i = 0; i < dockImageElements.length; i++)
        {
            dockImageElements[i].remove();
        }
        getShipIcons();
    }
}