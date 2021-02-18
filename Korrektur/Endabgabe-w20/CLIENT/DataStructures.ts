namespace FireworkCrafting {
    window.addEventListener("load", handleLoad);

    let form: HTMLFormElement;
    let url: string = "https://kisjasserver.herokuapp.com/";
    let rocketsAlive: Rocket[] = [];
    let rocketsLoaded: Config[] = [];

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    export let crc2: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

    canvas.addEventListener("click", ev => {
        shootRocket({x: ev.offsetX, y: ev.offsetY}, settings);
    });

    const loadedRocketsDropdown: HTMLSelectElement = <HTMLSelectElement>document.getElementById("loadedRockets");

    // >>>>>>>>>>>>>>>>> CONFIG <<<<<<<<<<<<<<<<<<<

    export type Config = {
        _id?: string; //id, welche von Mongodb automatisch vergeben wird
        hue: number; //hue values not colors 0-360
        particleRadius: number;
        particleNumber: number;
        particleSpeed: number;
    };

    let settings: Config = {
        hue: 0,
        particleRadius: 3,
        particleNumber: 400,
        particleSpeed: 10,
    };

    // >>>>>>>>>>>>>>>>> RAKETE ABFEUERN <<<<<<<<<<<<<<<<<<<

    function shootRocket(position: Vector2D, config: Config): void {
        rocketsAlive.push(new Rocket(position, config));
    }

    // >>>>>>>>>>>>>>>>> UPDATE FRAME <<<<<<<<<<<<<<<<<<<


    function updateFrame(): void {

        window.requestAnimationFrame(updateFrame);
        crc2.fillStyle = `rgba(0, 0, 0, 0.1)`;
        crc2.fillRect(0, 0, canvas.width, canvas.height);


        rocketsAlive.forEach((rocket, i) => {
            if (!rocket.finished()) {
                rocket.update();} else {rocketsAlive.splice(i, 1);}
        });
    }

    // >>>>>>>>>>>>>>>>> HANDLE LOAD <<<<<<<<<<<<<<<<<<<

    async function handleLoad(_event: Event): Promise<void> {
        console.log("——————————————〈  W i l l k o m m e n  〉————————————————"
            + "\n" + "     " );

        let response: Response = await fetch("Data.json"); // fetch soll nicht sofort "reinspringen",
        let selection: string = await response.text(); // bis Daten geladen sind > asynchronisieren + promise
        let data: Data = JSON.parse(selection);

        generateContent(data);

        // >>>>>>>>>>>>><<<<<<<<<<<<<

        form = <HTMLFormElement>document.querySelector("form");
        let slider: HTMLInputElement = <HTMLInputElement>document.querySelector("input#Geschwindigkeit");

        let buttonloeschen: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#buttonloeschen"); // DELETE
        let buttonspeichern: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#buttonspeichern");
        let buttonladen: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#buttonladen");
        let buttonimport: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#buttonimport");


        // <<<< ÖHRCHEN >>>>

        form.addEventListener("change", handleChange);
        slider.addEventListener("input", displayAmount);

        buttonloeschen.addEventListener("click", deleteData); // DELETE
        buttonspeichern.addEventListener("click", submitData);
        buttonladen.addEventListener("click", loadData);
        buttonimport.addEventListener("click", importData);
    }

    // >>>>>>>>>>>>>>>>> HANDLE CHANGE <<<<<<<<<<<<<<<<<<<

    function handleChange(_event: Event): void {
        let order: HTMLDivElement = <HTMLDivElement>document.querySelector("div#order"); // div mit id-Attribut order
        order.innerHTML = " "; // leeres order-Feld beim Start (" " = leerer String)
        let formData: FormData = new FormData(document.forms[0]); // formData: (vom Typen) FormData
        let settingsValues: number[] = [];
        for (let entry of formData) {
            console.log(entry[0] + ": " + entry[1]);

            settingsValues.push(parseInt(<string>entry[1]));

            let item: HTMLInputElement = <HTMLInputElement>document.querySelector("[value='" + entry[1] + "']");
            order.innerHTML += "<br> <strong>" + entry[0] + ": </strong> " + item.value + "<br>";
        }
        settings.hue = settingsValues[0];               // kategorien 0 - 3 werden abgegriffen aus Datá.jasón
        settings.particleRadius = settingsValues[1];
        settings.particleNumber = settingsValues[2];
        settings.particleSpeed = settingsValues[3];
        console.log("\n" + "♦———————————————————————————————————————————————♦"   );
    }


    // >>>>>>>>>>>>>>>>> DISPLAY AMOUNT <<<<<<<<<<<<<<<<<<<

    function displayAmount(_event: Event): void {
        let progress: HTMLProgressElement = <HTMLProgressElement>document.querySelector("progress"); // was man nicht sieht..
        let amount: string = (<HTMLInputElement>_event.target).value;
        progress.value = parseFloat(amount);
    }

    // >>>>>>>>>>>>>>>>> BUTTONS <<<<<<<<<<<<<<<<<<<

    // DELETE DATA
    function deleteData(): void {
        let order: HTMLDivElement = <HTMLDivElement>document.querySelector("div#order");
        order.innerHTML = "Deine Zusammenstellung ...";
        console.log("\n" + "    ♦—◊——◊——◊—〈 AUSWAHL GELÖSCHT 〉—◊——◊——◊—♦" + "\n" + "    " );
    }

    function submitData(_event: Event) {
        let query: URLSearchParams = new URLSearchParams();
        settings._id = undefined;
        query.append("RocketConfig", JSON.stringify(settings));
        query.append("type", "put");
        fetch(url + "?" + query.toString());
        alert("\n" + "   ♦—◊——◊——◊—〈 AUSWAHL ÜBERMITTELT 〉—◊——◊——◊—♦" + "\n" + "   " );
        // console.log("\n" + "♦———————————————————————————————————————————————♦"   );
    }

    async function loadData(_event: Event) {
        let query: URLSearchParams = new URLSearchParams();     // "group"
        query.append("type", "get");
        const response: Response = await fetch(url + "?" + query.toString());
        const data: Config[] = await response.json();

        loadedRocketsDropdown.innerHTML = " "; // !!!!!
        let counter: number = 0;

        data.forEach(firework => {
            counter++;
            const newOption: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");

            newOption.value = <string>firework._id;
            newOption.text = counter.toString();
            loadedRocketsDropdown.add(newOption);
        });
        rocketsLoaded = data;
    }

    function importData() {
        let id: string = loadedRocketsDropdown.value;
        const selectedSettings: Config = <Config>rocketsLoaded.find(firework => {
            return firework._id == id;});
        settings = selectedSettings;
    }
    updateFrame();
}
