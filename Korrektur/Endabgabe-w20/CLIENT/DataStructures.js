"use strict";
var FireworkCrafting;
(function (FireworkCrafting) {
    window.addEventListener("load", handleLoad);
    let form;
    let url = "https://kisjasserver.herokuapp.com/";
    let rocketsAlive = [];
    let rocketsLoaded = [];
    const canvas = document.getElementById("canvas");
    FireworkCrafting.crc2 = canvas.getContext("2d");
    canvas.addEventListener("click", ev => {
        shootRocket({ x: ev.offsetX, y: ev.offsetY }, settings);
    });
    const loadedRocketsDropdown = document.getElementById("loadedRockets");
    let settings = {
        hue: 0,
        particleRadius: 3,
        particleNumber: 400,
        particleSpeed: 10,
    };
    // >>>>>>>>>>>>>>>>> RAKETE ABFEUERN <<<<<<<<<<<<<<<<<<<
    function shootRocket(position, config) {
        rocketsAlive.push(new FireworkCrafting.Rocket(position, config));
    }
    // >>>>>>>>>>>>>>>>> UPDATE FRAME <<<<<<<<<<<<<<<<<<<
    function updateFrame() {
        window.requestAnimationFrame(updateFrame);
        FireworkCrafting.crc2.fillStyle = `rgba(0, 0, 0, 0.1)`;
        FireworkCrafting.crc2.fillRect(0, 0, canvas.width, canvas.height);
        rocketsAlive.forEach((rocket, i) => {
            if (!rocket.finished()) {
                rocket.update();
            }
            else {
                rocketsAlive.splice(i, 1);
            }
        });
    }
    // >>>>>>>>>>>>>>>>> HANDLE LOAD <<<<<<<<<<<<<<<<<<<
    async function handleLoad(_event) {
        console.log("——————————————〈  W i l l k o m m e n  〉————————————————"
            + "\n" + "     ");
        let response = await fetch("Data.json"); // fetch soll nicht sofort "reinspringen",
        let selection = await response.text(); // bis Daten geladen sind > asynchronisieren + promise
        let data = JSON.parse(selection);
        FireworkCrafting.generateContent(data);
        // >>>>>>>>>>>>><<<<<<<<<<<<<
        form = document.querySelector("form");
        let slider = document.querySelector("input#Geschwindigkeit");
        let buttonloeschen = document.querySelector("#buttonloeschen"); // DELETE
        let buttonspeichern = document.querySelector("#buttonspeichern");
        let buttonladen = document.querySelector("#buttonladen");
        let buttonimport = document.querySelector("#buttonimport");
        // <<<< ÖHRCHEN >>>>
        form.addEventListener("change", handleChange);
        slider.addEventListener("input", displayAmount);
        buttonloeschen.addEventListener("click", deleteData); // DELETE
        buttonspeichern.addEventListener("click", submitData);
        buttonladen.addEventListener("click", loadData);
        buttonimport.addEventListener("click", importData);
    }
    // >>>>>>>>>>>>>>>>> HANDLE CHANGE <<<<<<<<<<<<<<<<<<<
    function handleChange(_event) {
        let order = document.querySelector("div#order"); // div mit id-Attribut order
        order.innerHTML = " "; // leeres order-Feld beim Start (" " = leerer String)
        let formData = new FormData(document.forms[0]); // formData: (vom Typen) FormData
        let settingsValues = [];
        for (let entry of formData) {
            console.log(entry[0] + ": " + entry[1]);
            settingsValues.push(parseInt(entry[1]));
            let item = document.querySelector("[value='" + entry[1] + "']");
            order.innerHTML += "<br> <strong>" + entry[0] + ": </strong> " + item.value + "<br>";
        }
        settings.hue = settingsValues[0]; // kategorien 0 - 3 werden abgegriffen aus Datá.jasón
        settings.particleRadius = settingsValues[1];
        settings.particleNumber = settingsValues[2];
        settings.particleSpeed = settingsValues[3];
        console.log("\n" + "♦———————————————————————————————————————————————♦");
    }
    // >>>>>>>>>>>>>>>>> DISPLAY AMOUNT <<<<<<<<<<<<<<<<<<<
    function displayAmount(_event) {
        let progress = document.querySelector("progress"); // was man nicht sieht..
        let amount = _event.target.value;
        progress.value = parseFloat(amount);
    }
    // >>>>>>>>>>>>>>>>> BUTTONS <<<<<<<<<<<<<<<<<<<
    // DELETE DATA
    function deleteData() {
        let order = document.querySelector("div#order");
        order.innerHTML = "Deine Zusammenstellung ...";
        console.log("\n" + "    ♦—◊——◊——◊—〈 AUSWAHL GELÖSCHT 〉—◊——◊——◊—♦" + "\n" + "    ");
    }
    function submitData(_event) {
        let query = new URLSearchParams();
        settings._id = undefined;
        query.append("RocketConfig", JSON.stringify(settings));
        query.append("type", "put");
        fetch(url + "?" + query.toString());
        alert("\n" + "   ♦—◊——◊——◊—〈 AUSWAHL ÜBERMITTELT 〉—◊——◊——◊—♦" + "\n" + "   ");
        // console.log("\n" + "♦———————————————————————————————————————————————♦"   );
    }
    async function loadData(_event) {
        let query = new URLSearchParams(); // "group"
        query.append("type", "get");
        const response = await fetch(url + "?" + query.toString());
        const data = await response.json();
        loadedRocketsDropdown.innerHTML = " "; // !!!!!
        let counter = 0;
        data.forEach(firework => {
            counter++;
            const newOption = document.createElement("option");
            newOption.value = firework._id;
            newOption.text = counter.toString();
            loadedRocketsDropdown.add(newOption);
        });
        rocketsLoaded = data;
    }
    function importData() {
        let id = loadedRocketsDropdown.value;
        const selectedSettings = rocketsLoaded.find(firework => {
            return firework._id == id;
        });
        settings = selectedSettings;
    }
    updateFrame();
})(FireworkCrafting || (FireworkCrafting = {}));
//# sourceMappingURL=DataStructures.js.map