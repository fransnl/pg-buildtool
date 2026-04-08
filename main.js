let FF_FOUC_FIX;

let dataDisplayed = document.getElementById("data-displayed");
let sortingButtons = document.getElementById("sorting-buttons");
let buildStats = document.getElementById("build-stats");
let statLabels = document.getElementById("stat-labels");
let equippedGear = document.getElementById("equipped-gear");
let inputContainer = document.getElementById("input-container");

let save = {
    "gear": [
        {
            "EquipSlot": "Head",
            "id": "item_44286",
        },
        {
            "EquipSlot": "Chest",
            "id": "",
        },
        {
            "EquipSlot": "Legs",
            "id": "",
        },
        {
            "EquipSlot": "Feet",
            "id": "",
        },
        {
            "EquipSlot": "Hands",
            "id": "",
        },
        {
            "EquipSlot": "MainHand",
            "id": "",
        },
        {
            "EquipSlot": "Secondary",
            "id": "",
        },
        {
            "EquipSlot": "Necklace",
            "id": "",
        },
        {
            "EquipSlot": "Ring",
            "id": "",
        },
        {
            "EquipSlot": "Racial",
            "id": "",
        },
    ],
}

async function getData() {
    const itemUrl = 'https://cdn.projectgorgon.com/v466/data/items.json';
    const attributeUrl = 'https://cdn.projectgorgon.com/v466/data/attributes.json';
    const abilitiesUrl = 'https://cdn.projectgorgon.com/v466/data/abilities.json';
    try {

        const response = await fetch(itemUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json();

        const responseAttributes = await fetch(attributeUrl);
        if (!responseAttributes.ok) {
            throw new Error(`Response status: ${responseAttributes.status}`)
        }

        const resultAttributes = await responseAttributes.json();

        const responseAbilities = await fetch(abilitiesUrl);
        if (!responseAttributes.ok) {
            throw new Error(`Response status: ${responseAttributes.status}`)
        }

        const resultAbilities = await responseAbilities.json();

        console.log(filterAbilitiesClass(resultAbilities, "FireMagic"))

        let c = read_cookie("save");

        if (s = null) {
            bake_cookie("save", save);
        }

        initElements(result, resultAttributes);

        handleInput(result, resultAttributes);

        return result;
    } catch (error) {
        console.error(error.message);
    }
}

function handleInput(result, resultAttributes){
    let saveButton = document.getElementById('save-button');
    let inputs = inputContainer.querySelectorAll('input');


    saveButton.addEventListener('click', () => {
        inputs.forEach(input => {
            console.log(input.id, input.value)
            if(input.value != "") {
                switch (input.id) {
                    case "head":
                        save.gear[0].id = input.value;
                        break;
                    case "chest":
                        save.gear[1].id = input.value;
                        break;
                    case "legs":
                        save.gear[2].id = input.value;
                        break;
                    case "feet":
                        save.gear[3].id = input.value;
                        break;
                    case "hands":
                        save.gear[4].id = input.value;
                        break;
                    case "mainhand":
                        save.gear[5].id = input.value;
                        break;
                    case "secondary":
                        save.gear[6].id = input.value;
                        break;
                    case "necklace":
                        save.gear[7].id = input.value;
                        break;
                    case "ring":
                        save.gear[8].id = input.value;
                        break;
                    case "racial":
                        save.gear[9].id = input.value;
                        break;
                
                    default:
                        break;
                }
            }

        })
        delete_cookie("save");
        bake_cookie("save", save);
        displayStats(result, resultAttributes);
    })
}

function initElements(result, resultAttributes) {

    const categories = [
        "Cloth Armor",
        "Leather Armor",
        "Metal Armor",
        "Organic Armor",
        "Necklace",
        "Ring",
        "Belt",
        "Racial",
        "Animal Shoes",
        "Staff",
        "Fire Staff",
        "Ice Staff",
        "Weather Staff",
        "Wooden",
        "Club",
        "Hammer",
        "Shield",
        "Bard Instrument",
        "Orb",
        "Chemistry Beaker",
        "Chemistry Flask",
        "Bow",
        "Dirk",
        "Crossbow" 
    ]

    categories.forEach(c => {
        let button = document.createElement('button');
        button.innerText = c;
        cid = structuredClone(c);
        cid = cid.split(' ').join('-').toLocaleLowerCase();
        button.id = cid;
        button.classList = "sorting-button";
        button.addEventListener('click', () => {
            let items = filter(result, c, 0);

            const buttons = sortingButtons.querySelectorAll('.sorting-button');
            buttons.forEach(btn => btn.classList.remove('button-selected'));
            
            button.classList.add('button-selected');

            displayItems(items, resultAttributes);
        });
        sortingButtons.insertAdjacentElement("beforeend", button);
    });

    let initItems = filter(result, categories[0], 50);
    displayItems(initItems, resultAttributes);

    displayStats(result, resultAttributes);
}

function buttonSelected(id){
    let buttons = sortingButtons.querySelectorAll('button');
    buttons.forEach(b => {
        if (b.id == id){
            b.className = "button-selected"
        } else {
            b.className = "sorting-button";
        }
    });
}

function displayStats(result, resultAttributes){
    let stats = {};

    let s = read_cookie("save");

    equippedGear.innerHTML = "";
    statLabels.innerHTML = "";

    s?.gear.forEach(gear => {
        if(gear.id != "") {
            let item = filterForItem(result, gear.id);

            equippedGear.insertAdjacentHTML(
                "beforeend",
                `
                        <div class="item">
                            <div class="item-header">
                                <img src="https://cdn.projectgorgon.com/v456/icons/icon_${item[0].IconId}.png"/>
                                <div class="item-title">
                                    <a href="https://wiki.projectgorgon.com/wiki/${item[0].id}" target="_blank" rel="noopener noreferrer">${item[0].Name}</a>
                                    <h4>Crafting target level ${item[0].CraftingTargetLevel}</h4>
                                </div>
                            </div>
                            <div class="shiny-border"></div>
                            <div class="attributes-content">
                                <div id="combat-refresh-container" class="combat-refresh-container"></div>
                                <p class="item-description">${item[0].Description}</p>
                                <div class="attributes-container">
                                    <p class="attributes-title">ATTRIBUTES</p>
                                    <div id="attributes-equipped-${item[0].id}" class="attributes">
                                    </div>
                                </div>
                            </div>
                            <div class="attributes-footer">
                                <h4>Endurance lvl ${item[0].SkillReqs?.Endurance} item id: ${item[0].id}</h4>
                            </div>
                        </div>`
            );
            
            let attributesContainer = document.getElementById(`attributes-equipped-${item[0].id}`);

            item[0].EffectDescs.forEach(attribute => {
                
                let [type, value] = attribute.split(/[{}]/).filter(Boolean);
                let n = Number(value)
                n = n % 1 !== 0 ? n * 100 : n;

                if (type && value) {
                    attributesContainer.insertAdjacentHTML(
                        "beforeend",
                        `<div style="display: flex; align-items: center; gap: 10px;">
                                ${resultAttributes[type]?.IconIds?.[0] != undefined ? `<img height="25" src="https://cdn.projectgorgon.com/v456/icons/icon_${resultAttributes[type].IconIds[0]}.png"/>` : ""}
                                <p>${resultAttributes[type].Label} ${value}</p>
                            <div/>`
                    );

                } else {
                    attributesContainer.insertAdjacentHTML(
                        "beforeend",
                        `<div style="display: flex; align-items: center; gap: 10px;">
                            <p>${type}</p>
                        <div/>`
                    );
                }

                if (stats[type] == undefined) {
                    stats[type] = value != undefined ? n : 0;
                }
                else {
                    stats[type] = stats[type] + n
                }
            });
        }
    })

    for ( var stat in stats ) {
        statLabels.insertAdjacentHTML("beforeend", 
            `
            <div class="stat-label">
                ${resultAttributes[stat]?.IconIds?.[0] != undefined ? `<img height="25" src="https://cdn.projectgorgon.com/v456/icons/icon_${resultAttributes[stat].IconIds[0]}.png"/>` : ""}
                <p>${resultAttributes[stat]?.Label ? resultAttributes[stat]?.Label : stat} ${stats[stat] == 0 ? "": stats[stat]}</p>
            </div>
            `
        );

    }

}

function displayItems(items, resultAttributes) {
    dataDisplayed.innerHTML = "";
    //document.body.insertAdjacentHTML("afterbegin", `<h1>Number of items: ${items.length}</h1>`);
    items.forEach(item => {

        let div = document.createElement("div");
        div.id = item.id;
        div.className = "item";

        let itemUrl = item.Name.split(' ').join('_');

        dataDisplayed.insertAdjacentElement("beforeend", div);

        div.insertAdjacentHTML(
            "beforeend",
            `
                    <div class="item-header">
                        <img src="https://cdn.projectgorgon.com/v456/icons/icon_${item.IconId}.png"/>
                        <div class="item-title">
                            <a href="https://wiki.projectgorgon.com/wiki/${itemUrl}" target="_blank" rel="noopener noreferrer">${item.Name}</a>
                            <h4>${item.CraftingTargetLevel != undefined ? "Crafting target level " + item.CraftingTargetLevel : "No target level"}</h4>
                        </div>
                    </div>
                    <div class="shiny-border"></div>
                    <div class="attributes-content">
                        <p class="item-description">${item.Description}</p>
                        <div class="attributes-container">
                            <p class="attributes-title">ATTRIBUTES</p>
                            <div id="attributes-${item.id}" class="attributes">
                            </div>
                        </div>
                    </div>
                    <div class="attributes-footer">
                        <h4>Endurance lvl ${item.SkillReqs?.Endurance} item id: ${item.id}</h4>
                    </div>`
        );

        const attributesContainer = document.getElementById(`attributes-${item.id}`)

        item.EffectDescs.forEach(attibute => {
            let [type, value] = attibute.split(/[{}]/).filter(Boolean);
            value = Number(value)
            value = value % 1 !== 0 ? value * 100 : value;
            if (type && value) {
                attributesContainer.insertAdjacentHTML(
                    "beforeend",
                    `<div style="display: flex; align-items: center; gap: 10px;">
                            ${resultAttributes[type]?.IconIds?.[0] != undefined ? `<img height="25" src="https://cdn.projectgorgon.com/v456/icons/icon_${resultAttributes[type].IconIds[0]}.png"/>` : ""}
                            <p>${resultAttributes[type].Label} ${value}</p>
                        <div/>`
                );

            } else {
                attributesContainer.insertAdjacentHTML(
                    "beforeend",
                    `<div style="display: flex; align-items: center; gap: 10px;">
                        <p>${type}</p>
                    <div/>`
                );
            }
        })
    });
}

function filterAll(result) {
    let i = Object.entries(result)
        .filter(([id, item]) =>
            item.CraftingTargetLevel >= 30
        )
        .map(([id, item]) => ({ id, ...item }))
        .sort((a, b) => (a.CraftingTargetLevel || 0) - (b.CraftingTargetLevel || 0));

    return i
}

function filter(result, filter, lvl) {
    
    let i = Object.entries(result)
        .filter(([id, item]) =>
            item.Keywords?.includes(filter.split(' ').join(''))
            && !item.Keywords?.includes("Lint_NotObtainable")
    )
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => (a.CraftingTargetLevel || 0) - (b.CraftingTargetLevel || 0));
    
    //&& item.CraftingTargetLevel >= lvl
    return i
}

function filterForItem(result, id) {
    
    let i = Object.entries(result)
        .filter(([itemId, item]) =>
            itemId === id
        ).map(([itemId, item]) => ({ id: itemId, ...item}));
    
    return i
}

function filterAbilitiesClass(resultAbilities, skill) {
    let a = Object.entries(resultAbilities)
        .filter(([id, ability]) =>
            ability.Skill === skill
            && ability.Keywords.includes("Calefaction")
        )
        .map(([id, ability]) => ({ id, ...ability }))

    return a
}

function bake_cookie(name, value) {
  var cookie = `${name}=${JSON.stringify(value)}`;
  document.cookie = cookie;
}

function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}

function delete_cookie(name) {
  document.cookie = `${name}=${JSON.stringify(save)}; max-age=0`;//'=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.';
}

getData();

// {
//   "id": "item_40116",
//   "Behaviors": [
//     {
//       "UseVerb": "Equip"
//     }
//   ],
//   "CraftPoints": 100,
//   "CraftingTargetLevel": 50,
//   "Description": "Popular with elven messengers, these elegant cloth footwraps make your feet move much faster! But they don't protect your feet very well, so you'll need significant endurance to tolerate the numerous stubbed toes and sprained ankles.",
//   "EffectDescs": [
//     "{MAX_ARMOR}{25}",
//     "{SPRINT_BOOST}{2}",
//     "{COMBAT_REFRESH_HEALTH_DELTA}{30}",
//     "{COMBAT_REFRESH_POWER_DELTA}{27}"
//   ],
//   "EquipAppearance": "@Feet=@eq-{sex}-steel-feet-01(^Armor=rugged-comp%DYE%)",
//   "EquipAppearance2": "@Feet=@eq-{sex}2-feet-flats-01(^Armor={sex}2-feet-flats-01%DYE%)",
//   "EquipSlot": "Feet",
//   "IconId": 10102,
//   "InternalName": "WindstepShoes",
//   "IsSkillReqsDefaults": true,
//   "Keywords": [
//     "Armor",
//     "ArmorOrShield",
//     "ClothArmor",
//     "ClothBoots",
//     "ClothDyeableArmor",
//     "Equipment",
//     "Fashionable",
//     "Feet",
//     "Loot",
//     "WindstepShoes"
//   ],
//   "MaxStackSize": 1,
//   "Name": "Windstep Shoes",
//   "SkillReqs": {
//     "Endurance": 30
//   },
//   "StockDye": ";Color1=003300;Color2=777777;Color3=337700",
//   "TSysProfile": "All",
//   "Value": 150
// }