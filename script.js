let modal = document.getElementById("dock-modal");
let dock = document.getElementById("dock");
let closeButton = document.getElementById("close-modal");

dock.onclick = function() 
{
    modal.style.display = "block";
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

/**
 * Determines whether an icon from the dock has been selected
 * or unselected. If selected, then adds the ship to the selectedShips
 * array. If unselected, then removes said ship from array. Updates the
 * icons in rotation by calling updateRotation() each time.
 * @param {String} shipID - name of ship that has been clicked
 */
function clickedShipIcon(shipID)
{
    console.log(shipID);
    let test1 = document.getElementById(`${shipID}-dock`);
    if(test1.hasAttribute("style") && test1.getAttribute("style") === "filter: brightness(0.25);")
    {
        test1.style.filter = "brightness(1)";
        const index = selectedShips.indexOf(shipID);
        if(index !== -1)
        {
            selectedShips.splice(index, 1);
        }
        updateRotation(shipID, false);
    }
    else
    {
        test1.style.filter = "brightness(0.25)";
        selectedShips.push(shipID);
        updateRotation(getShipObject(shipID), true);
    }
}

/**
 * Calculates time until weekly reset in Azur Lane and injects
 * information into "reset-time" div id element.
 */
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
    /*
    // For debugging
    for(let i = 0; i < selectedShips.length; i++)
    {
        console.log(selectedShips[i]);
    }
    */
}

/**
 * Helper function for timeUntilReset(). Gets minutes/seconds and adds "0" to
 * tens digit when needed.
 * @param {number} time - number in minutes/seconds
 * @returns {number}
 */
function addExtraZero(time)
{
    if(time < 10)
    {
        return "0" + time;
    }
    return time;
}

const selectedShips = [];
const dockArr = [];

/**
 * Fetches the ships.json from the repo.
 */
async function fetchJSON() {
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

/**
 * Waits for fetchJSON's response and uses that information
 * to construct the dockArr array of ship objects.
 */
async function addToDock()
{
    const arr = await fetchJSON();
    console.log(arr.ships);

    for(let i = 0; i < arr.ships.length; i++)
    {
        dockArr.push(arr.ships[i]);
    }
    getShipIcons();
}
addToDock();

/**
 * Function is called only when the page is first opened. Adds the icons
 * of the ships in selectedShips array to the "rotationShips" div id and
 * ships in dockArr array to the "shipIcons" div id.
 */
function getShipIcons()
{
    for(let j = 0; j < selectedShips.length; j++)
    {
        addImage(getShipObject(selectedShips[j]), "rotationShips", "rotation");
    }
    for(let i = 0; i < dockArr.length; i++)
    {
        addImage(dockArr[i], "shipIcons", "dock");
    }
}

/**
 * Helper function to add ship icon to html of page.
 * @param {object} ship - Ship object containing info such as name, icon url, etc.
 * @param {String} id - Tag ID of the element where the image will be injected.
 * @param {string} where - String saying where the element will be used.      
 */ 
function addImage(ship, id, where)
{
    let image = `<img class='${ship.rarity}' id='${ship.name}-${where}' src='${ship.icon}' alt='${ship.name}' width='90' onclick='clickedShipIcon(this.alt)'>`;
    //console.log(image);
    document.getElementById(id).innerHTML += image;
}

/**
 * When a ship is added or removed from the selectedShips array, this
 * function is called to remove/add the image from the page to reflect
 * the change.
 */
function updateRotation(ship, added)
{
    if(added)
    {
        addImage(ship, "rotationShips", "rotation");
    }
    else
    {
        document.getElementById(`${ship}-rotation`).remove();
    }
}

/**
 * Given the ship name, the function will return the object from dockArr that
 * refers to the ship with the same name.
 * @param {String} shipName - Name of the ship
 * @returns {object}
 */
function getShipObject(shipName)
{
    for(let i = 0; i < dockArr.length; i++)
    {
        if(dockArr[i].name === shipName)
        {
            return dockArr[i];
        }
    }
}

/**
 * TODO: 
 * [] Clicking icon in rotation may be a bug/feature? Change as see fit.
 * [] Current secretaries shoud be taken from ships in rotation.
 * [] Add array for ships that are out of rotation.
 * [] Make sure ships are taken randomly from selectedShips[].
 * [] Current secretaries should be rotated during weekly reset.
 */