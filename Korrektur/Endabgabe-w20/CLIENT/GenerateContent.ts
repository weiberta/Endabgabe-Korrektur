namespace FireworkCrafting {

    export interface Item {
        name: string;
    }

    export interface Data {
        [category: string]: Item[];
    }

    export function generateContent(_data: Data) {

        for (let category in _data) {       // for in gibt in der Variable nur die Schlüssel wieder (Schlüssel ist die Kategorie)
            let items: Item [] = _data[category];  // ITEMS aus Data.json exportieren

            let group: HTMLElement | null = null;   // group muss 1 x deklariert werden = unklar was mit den vielen groups gemacht werden soll (zu viele Funktionsbereiche)
            switch (category) {                           // switch (KEY)
                case "Radius":                 // case "VALUE"  > sollte der Schlüssel ein fw-Körper sein SelectElement
                    group = createSingle(items, category);     //  mit Optionen aufrufen + was erzeugt wurde in eine Gruppe speichern
                    break;
                case "Anzahl":
                    group = createSingle(items, category);
                    break;
                case "Farbe":
                    group = createSelect(items, category);
                    break;
                default:
                    break;
            }

            let fieldset: HTMLFieldSetElement | null = document.querySelector("fieldset#" + category);
            if (fieldset && group)
                fieldset.appendChild(group);
        }
    }

    // >>>>>>>>>>>> FUNCTION CREATESELECT() <<<<<<<<<<<<<

    function createSingle(_items: Item[], _category: string): HTMLElement | null {
        let group: HTMLDivElement = document.createElement("div");


        for (let item of _items) {
            let radio: HTMLInputElement = document.createElement("input");
            radio.type = "radio";
            radio.checked = true;
            radio.value = item.name;
            radio.name = _category;
            radio.id = item.name;

            let br: HTMLBRElement = document.createElement("br");
            let label: HTMLLabelElement = document.createElement("label");
            label.textContent = item.name;
            label.htmlFor = item.name;

            group.appendChild(radio);
            group.appendChild(label);
            group.appendChild(br);
        }
        return group;
    }

    function createSelect(_items: Item[], _category: string): HTMLElement | null {
        let group: HTMLSelectElement = document.createElement("select");
        group.name = _category;
        group.id = _category;

        for (let item of _items) {
            let option: HTMLOptionElement = document.createElement("option");
            option.value = option.textContent = item.name;
            option.id = item.name;

            group.appendChild(option);
        }
        return group;
    }
}


