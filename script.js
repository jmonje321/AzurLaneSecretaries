let modal = document.getElementById("dock-modal");
let dock = document.getElementById("dock");
let closeButton = document.getElementById("close");
let clearButton = document.getElementById("clear");
let selectAllButton = document.getElementById("selectAll");
let firstDockClick = true;

dock.onclick = function() 
{
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    if(firstDockClick)
    {
        // Adds ships from dockArr[] to dock modal.
        setTimeout(function()
        {
            for(let i = 0; i < dockArr.length; i++)
            {
                addImage(dockArr[i], "shipIcons", "dock");
                if(toDarken.includes(dockArr[i])) darkenIcon(dockArr[i], "dock");
            }
            firstDockClick = false;
            showPage();
        }, 1000);
    }
}

closeButton.onclick = function()
{
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
}

// onclick function for "Clear All" button. Removes all 
// selected ships and resets brightness of icons.
clearButton.onclick = function()
{
    let dockShips = document.getElementsByClassName("dock");
    for(let i = 0; i < dockShips.length; i++)
    {
        if(dockShips[i].hasAttribute("style") && dockShips[i].getAttribute("style") === "filter: brightness(0.25);")
        {
            clickedShipIcon(dockShips[i].alt);
        }
    }
}

selectAllButton.onclick = function()
{
    document.getElementById("loader-overlay").style.display = "block";
    
    setTimeout(function()
    {
        let dockShips = document.getElementsByClassName("dock");
        for(let i = 0; i < dockShips.length; i++)
        {
            if(!dockShips[i].hasAttribute("style"))
            {
                clickedShipIcon(dockShips[i].alt);
            }
        }
        document.getElementById("loader-overlay").style.display = "none";
    }, 1000); 
}

window.addEventListener("click", function(event)
{
    if(event.target == modal)
    {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
    }
})

// Removes loader and shows content of modal. Is called when
// all ship icons in modal are finished loading.
function showPage()
{
    document.getElementById("loader-overlay").style.display = "none";
    document.getElementById("content").style.display = "block";
}

function setSecretaryNum(object)
{
    localStorage.setItem("secretaryNum", object.options[object.selectedIndex].value);
}

// Used by search bar in modal to filter ship icons by name.
function filter()
{
    let txtValue;
    let input = document.getElementById("shipFilter");
    let filter = input.value.toUpperCase();
    let div = document.getElementById("shipIcons");
    let img = div.getElementsByTagName("img");
    for (let i = 0; i < img.length; i++) {
        txtValue = img[i].getAttribute('alt');
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            img[i].style.display = "";
        } else {
            img[i].style.display = "none";
        }
    }
}

/**
 * Determines whether an icon from the dock has been selected
 * or unselected. If selected, then adds the ship to the selectedShips
 * array. If unselected, then removes said ship from array. Updates the
 * icons in rotation by calling updateRotation() each time.
 * @param {String} shipID - name of ship that has been clicked
 */
function clickedShipIcon(shipID)
{
    let test1 = document.getElementById(`${shipID}-dock`);
    if(test1.hasAttribute("style") && test1.getAttribute("style") === "filter: brightness(0.25);")
    {
        test1.removeAttribute("style");
        let index = selectedShips.indexOf(shipID);
        let where;
        if(index !== -1)
        {
            selectedShips.splice(index, 1);
            where = "rotation";
        }
        else
        {
            index = currentSecretaries.indexOf(shipID);
            if(index !== -1)
            {
                currentSecretaries.splice(index, 1);
                where = "secretaries"
            }
            else
            {
                index = alreadySelected.indexOf(shipID);
                if(index !== -1)
                {
                    alreadySelected.splice(index, 1);
                    where = "nonrotation"
                }
            }
        }

        updateRotation(shipID, false, where);
    }
    else
    {
        test1.style.filter = "brightness(0.25)";
        selectedShips.push(shipID);
        let ship = getShipObject(shipID);
        updateRotation(ship, true);

        if(!images.has(shipID))
        {
            let image = new Image(173);
            image.src = ship.shipyard;
            image.alt = ship.name;
            images.set(ship.name, image);
        }
    }
    localStorage.setItem("rotation", JSON.stringify(selectedShips));
    localStorage.setItem("secretaries", JSON.stringify(currentSecretaries));
    localStorage.setItem("outRotation", JSON.stringify(alreadySelected));
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

let selectedShips;
const dockArr = [];
let currentSecretaries;
let alreadySelected;

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

    for(let i = 0; i < arr.ships.length; i++)
    {
        dockArr.push(arr.ships[i]);
    }

    if("secretaryNum" in localStorage)
    {
        document.getElementById("secretary-amount").value = localStorage.getItem("secretaryNum");
    }

    if("rotation" in localStorage)
    {
        selectedShips = JSON.parse(localStorage.getItem("rotation"));
    }
    else
    {
        selectedShips = [];
    }

    if("secretaries" in localStorage)
    {
        currentSecretaries = JSON.parse(localStorage.getItem("secretaries"));
    }
    else
    {
        currentSecretaries = [];
    }

    if("outRotation" in localStorage)
    {
        alreadySelected = JSON.parse(localStorage.getItem("outRotation"));
    }
    else
    {
        alreadySelected = [];
    }

    getShipIcons();
}
addToDock();

const toDarken = [];
/**
 * Function is called only when the page is first opened. Adds the icons
 * of the ships in selectedShips array to the "rotationShips" div id and
 * ships in dockArr array to the "shipIcons" div id.
 */
function getShipIcons()
{
    // Adds ships from currentSecretaries[] to Current Secretaries section.
    let ship;
    for(let k = 0; k < currentSecretaries.length; k++)
    {
        ship = getShipObject(currentSecretaries[k]);
        let image = `<figure class='${ship.rarity}' id='${ship.name}-secretaries'><img src='${ship.shipyard}' alt='${ship.name}' width='172.8'><figcaption>${ship.name}</figcaption></figure>`;
        document.getElementById("secretaries").innerHTML += image;
        toDarken.push(ship);

        // adds ship to preload images map
        let imageObj = new Image(173);
        imageObj.src = ship.shipyard;
        imageObj.alt = ship.name;
        images.set(ship.name, imageObj);
    }
    // Adds ships from selectedShips[] to rotation ships section.
    for(let j = 0; j < selectedShips.length; j++)
    {
        ship = getShipObject(selectedShips[j]);
        addImage(ship, "rotationShips", "rotation");
        toDarken.push(ship);
    }
    // Adds ships from alreadySelected[] to Already Chosen section.
    for(let x = 0; x < alreadySelected.length; x++)
    {
        ship = getShipObject(alreadySelected[x]);
        addImage(ship, "nonrotationShips", "nonrotation");
        toDarken.push(ship);
    }
    preloadSecretaries();
}

let images = new Map();
// Preloads the shipyard icon of all the ships in selectedShips[] and alreadySelected[]
function preloadSecretaries()
{
    for(let i = 0; i < selectedShips.length; i++)
    {
        if(!images.has(selectedShips[i]))
        {
            let ship = getShipObject(selectedShips[i]);
            let image = new Image(173);
            image.src = ship.shipyard;
            image.alt = ship.name;
            images.set(ship.name, image);
        }
    }

    for(let x = 0; x < alreadySelected.length; x++)
    {
        if(!images.has(alreadySelected[x]))
        {
            let ship = getShipObject(alreadySelected[x]);
            let image = new Image(173);
            image.src = ship.shipyard;
            image.alt = ship.name;
            images.set(ship.name, image);
        }
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
    let image = `<img class='${where}' id='${ship.name}-${where}' src='${ship.icon}' title='${ship.name}' alt='${ship.name}' width='90' data-rarity='${ship.rarity}' draggable='false'>`;
    document.getElementById(id).innerHTML += image;
    
    if(where === "dock")
    {
        document.getElementById(`${ship.name}-dock`).setAttribute("onclick", `clickedShipIcon(document.getElementById('${ship.name}-dock').alt);`);
    }
}

/**
 * When a ship is added or removed from the selectedShips array, this
 * function is called to remove/add the image from the page to reflect
 * the change.
 */
function updateRotation(ship, added, where="dock")
{
    if(added)
    {
        addImage(ship, "rotationShips", "rotation");
    }
    else
    {
        document.getElementById(`${ship}-${where}`).remove(); // `${ship}-rotation`
    }
}

function darkenIcon(ship, where)
{
    document.getElementById(`${ship.name}-${where}`).style.filter = "brightness(0.25)";
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
 * Given the array of ship objects nextSecretariesArr, remove current secretaries
 * and move them to alreadySelected[]. Then adds new secretaries to currentSecretaries[].
 * Updates localStorage for outRotation and secretaries.
 * @param {Object[]} nextSecretariesArr - Ships that will be the new secretaries.
 */
function addSecretaries(nextSecretariesArr)
{
    // Removes old secretaries and puts them in alreadySelected[]
    for(let j = 0; j < currentSecretaries.length; j++)
    {
        document.getElementById(`${currentSecretaries[j]}-secretaries`).remove();
        alreadySelected.push(currentSecretaries[j]);

        addImage(getShipObject(currentSecretaries[j]), "nonrotationShips", "nonrotation"); // Test
    }
    localStorage.setItem("outRotation", JSON.stringify(alreadySelected));
    currentSecretaries.length = 0;


    let ship;
    for(let i = 0; i < nextSecretariesArr.length; i++)
    {
        ship = getShipObject(nextSecretariesArr[i]);

        let figureElement = document.createElement("figure");
        figureElement.setAttribute("class", ship.rarity);
        figureElement.setAttribute("id", `${ship.name}-secretaries`);
        let captionElement = document.createElement("figcaption");
        captionElement.innerText = ship.name;
        figureElement.appendChild(images.get(ship.name));
        figureElement.appendChild(captionElement);
        document.getElementById("secretaries").appendChild(figureElement);

        currentSecretaries.push(nextSecretariesArr[i]);
        updateRotation(nextSecretariesArr[i], false, "rotation"); // TEST
    }
    localStorage.setItem("secretaries", JSON.stringify(currentSecretaries));
}

/**
 * Shuffles the array of selected ships and splices an amount
 * equal to the number of secretary slots available. Sends the spliced
 * array to addSecretaries().
 */
function getNextSecretaries()
{
    let numSecretaries = document.getElementById("secretary-amount").value;

    shuffle(selectedShips);
    if(selectedShips.length <= numSecretaries)
    {
        shuffle(alreadySelected);
        selectedShips = selectedShips.concat(alreadySelected);
        for(let i = 0; i < alreadySelected.length; i++)
        {
            updateRotation(getShipObject(alreadySelected[i]), true);
            document.getElementById(`${alreadySelected[i]}-nonrotation`).remove()
        }
        alreadySelected.length = 0;
    }

    addSecretaries(selectedShips.splice(0, numSecretaries));
    localStorage.setItem("rotation", JSON.stringify(selectedShips));
}

// Shuffle array code from user coolaj86 from
// https://stackoverflow.com/a/2450976
function shuffle(array) 
{
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}