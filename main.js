let FF_FOUC_FIX;

let dataDisplayed = document.getElementById("data-displayed");
let sortingButtons = document.getElementById("sorting-buttons");
let buildStats = document.getElementById("build-stats");
let statLabels = document.getElementById("stat-labels");
let equippedGear = document.getElementById("equipped-gear");
let inputContainer = document.getElementById("input-container");
let radioButtonsContainer = document.getElementById("radio-buttons-container");

let save = {
    "gear": [
        {
            "EquipSlot": "Head",
            "id": "",
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
        {
            "EquipSlot": "Belt",
            "id": "",
        },
    ],
    "attributes": {
        "Flat": {},
        "Procentage": {},
        "FlatI": {},
        "ProcentageI": {},
        "FlatA": {},
        "ProcentageA": {},
    },
    "mods": []
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

        let c = read_cookie("save");

        if (c == null) {
            bake_cookie("save", save);
        } else {
            save = read_cookie("save");
        }
        
        initElements(result, resultAttributes);
        
        handleInput(result, resultAttributes);

        console.log("===SAVE===\n", save);

        console.log("\n===FIRE ABILITIES===\n")
        filterAbilitiesClass(resultAbilities, "FireMagic");

        return result;
    } catch (error) {
        console.error(error.message);
    }
}

function handleInput(result, resultAttributes) {
    let saveButton = document.getElementById('save-button');
    let inputs = inputContainer.querySelectorAll('input');


    saveButton.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.value !== "") {
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
                    case "belt":
                        save.gear[10].id = input.value;
                        break;

                    default:
                        break;
                }
                input.value = "";
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

            let items = filterItems(
                result,
                {
                    keywords: [c],
                    excludeKeywords: ["Lint_NotObtainable"],
                }
            );

            const buttons = sortingButtons.querySelectorAll('.sorting-button');
            buttons.forEach(btn => btn.classList.remove('button-selected'));

            button.classList.add('button-selected');

            displayRadioButtons(c, items, resultAttributes);

            displayItems(items, resultAttributes);
        });
        sortingButtons.insertAdjacentElement("beforeend", button);
    });

    let initItems = filterItems(
        result,
        {
            keywords: ["ClothArmor"],
            excludeKeywords: ["Lint_NotObtainable"],
        }
    );

    let button = document.getElementById('cloth-armor');
    button.classList.add('button-selected');

    displayRadioButtons("Cloth Armor", initItems, resultAttributes);

    displayItems(initItems, resultAttributes);

    displayStats(result, resultAttributes);
}

function displayRadioButtons(c, items, resultAttributes) {
    radioButtonsContainer.innerHTML = "";
    if (c == "Cloth Armor" || c == "Leather Armor" || c == "Metal Armor" || c == "Organic Armor") {
        radioButtonsContainer.insertAdjacentHTML(
            "beforeend",
            `
                <div id="armor-type-radio">
                    <input type="radio" id="all" name="armor_type" value="All" checked>
                    <label for="all">All</label>
                    <input type="radio" id="head" name="armor_type" value="Head">
                    <label for="head">Head</label>
                    <input type="radio" id="chest" name="armor_type" value="Chest">
                    <label for="chest">Chest</label>
                    <input type="radio" id="legs" name="armor_type" value="Legs">
                    <label for="legs">Legs</label>
                    <input type="radio" id="feet" name="armor_type" value="Feet">
                    <label for="feet">Feet</label>
                    <input type="radio" id="hands" name="armor_type" value="Hands">
                    <label for="hands">Hands</label>
                </div>
                <div id="crafting-level-input">
                    <label for="crafting-target-lvl">Minimum Crafting Target Level</label>
                    <input type="number" id="crafting-target-lvl" name="crafting_target_level" min="0" max="110" value="0"/>
                </div>
                <button id="filter-button">Filter ${c}</button>
                `
        );

        let button = document.getElementById('filter-button');
        button.addEventListener('click', () => {
            let armorType = document.querySelector('[name="armor_type"]:checked').value;
            let craftingLevel = document.querySelector('[name="crafting_target_level"]').value;

            let i = filterItems(
                items,
                {
                    keywords: armorType == "All" ? [] : [c, armorType],
                    minCraftingLvl: craftingLevel
                }
            );

            displayItems(i, resultAttributes);
        })
    } else {
        radioButtonsContainer.insertAdjacentHTML(
            "beforeend",
            `
                <div id="crafting-level-input">
                    <label for="crafting-target-lvl">Minimum Crafting Target Level</label>
                    <input type="number" id="crafting-target-lvl" name="crafting_target_level" min="0" max="110" value="0"/>
                </div>
                <button id="filter-button">Filter ${c}</button>
                `
        );

        let button = document.getElementById('filter-button');
        button.addEventListener('click', () => {
            let craftingLevel = document.querySelector('[name="crafting_target_level"]').value;

            let i = filterItems(
                items,
                {
                    minCraftingLvl: craftingLevel
                }
            );

            displayItems(i, resultAttributes);
        })
    }
}

function buttonSelected(id) {
    let buttons = sortingButtons.querySelectorAll('button');
    buttons.forEach(b => {
        if (b.id == id) {
            b.className = "button-selected"
        } else {
            b.className = "sorting-button";
        }
    });
}

function displayStats(result, resultAttributes) {
    let stats = {};

    let s = read_cookie("save");

    equippedGear.innerHTML = "";
    statLabels.innerHTML = "";

    s?.gear.forEach(gear => {
        if (gear.id != "") {
            let item = filterForItem(result, gear.id);

            equippedGear.insertAdjacentHTML(
                "beforeend",
                `
                        <div class="item">
                            <div class="item-header">
                                <img src="https://cdn.projectgorgon.com/v456/icons/icon_${item[0].IconId}.png"/>
                                <div class="item-title">
                                    <a href="https://wiki.projectgorgon.com/wiki/${item[0].Name.split(' ').join('_')}" target="_blank" rel="noopener noreferrer">${item[0].Name}</a>
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
                let norm = n % 1 !== 0 ? n * 100 : n;

                if (type && value) {
                    attributesContainer.insertAdjacentHTML(
                        "beforeend",
                        `<div style="display: flex; align-items: center; gap: 10px;">
                                ${resultAttributes[type]?.IconIds?.[0] != undefined ? `<img height="25" src="https://cdn.projectgorgon.com/v456/icons/icon_${resultAttributes[type].IconIds[0]}.png"/>` : ""}
                                <p>${resultAttributes[type].Label} ${norm}</p>
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

    for (var stat in stats) {
        let [id, prop, type] = stat.split('_');

        if (id == "MOD") {

            if (prop == "SKILL") {
                save.attributes.Procentage[type] = stats[stat];
            } else if (type == "DIRECT") {
                save.attributes.Procentage[prop] = stats[stat];
            } else if (type == "INDIRECT") {
                save.attributes.ProcentageI[prop] = stats[stat];
            } else if (type == undefined) {
                save.attributes.Procentage[prop] = stats[stat];
                save.attributes.ProcentageI[prop] = stats[stat];
            } else if (prop == "ABILITY") {
                save.attributes.ProcentageA[type] = stats[stat];
            }
        }

        if (id == "BOOST") {
            if (prop == "SKILL") {
                save.attributes.Flat[type] = stats[stat];
            } else if (type == "DIRECT") {
                save.attributes.Flat[prop] = stats[stat];
            } else if (type == "INDIRECT") {
                save.attributes.FlatI[prop] = stats[stat];
            } else if (type == undefined) {
                save.attributes.Flat[prop] = stats[stat];
                save.attributes.FlatI[prop] = stats[stat];
            } else if (prop == "ABILITY") {
                save.attributes.FlatA[type] = stats[stat];
            }
        }

        statLabels.insertAdjacentHTML("beforeend",
            `
            <div class="stat-label">
                ${resultAttributes[stat]?.IconIds?.[0] != undefined ? `<img height="25" src="https://cdn.projectgorgon.com/v456/icons/icon_${resultAttributes[stat].IconIds[0]}.png"/>` : ""}
                <p>${resultAttributes[stat]?.Label ? resultAttributes[stat]?.Label : stat} ${stats[stat] == 0 ? "" : stats[stat]}</p>
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
            && !item.Keywords?.includes("Crafted")
            && item.CraftingTargetLevel >= lvl

        )
        .map(([id, item]) => ({ id, ...item }))
        .sort((a, b) => (a.CraftingTargetLevel || 0) - (b.CraftingTargetLevel || 0));

    return i
}

function filterItems(result, options = {}) {
    const {
        keywords = [],
        excludeKeywords = [],
        minCraftingLvl = null,
        equipSlot = null,
    } = options;

    return Object.entries(result)
        .filter(([id, item]) => {
            if (minCraftingLvl !== null && (item.CraftingTargetLevel ?? 0) < minCraftingLvl) {
                return false;
            }

            if (equipSlot !== null && !(item.EquipSlot == equipSlot)) {
                return false
            }

            if (keywords.length > 0 && !keywords.every(keyword => item.Keywords?.includes(keyword.split(" ").join("")))) {
                return false
            }

            if (excludeKeywords.length > 0 && excludeKeywords.every(ekeyword => item.Keywords?.includes(ekeyword))) {
                return false
            }

            return true
        })
        .map(([id, item]) => ({ id, ...item }))
        .sort((a, b) => (a.CraftingTargetLevel || 0) - (b.CraftingTargetLevel || 0));
}

function filterForItem(result, id) {

    let i = Object.entries(result)
        .filter(([itemId, item]) =>
            itemId === id
        ).map(([itemId, item]) => ({ id: itemId, ...item }));

    return i
}

function filterAbilitiesClass(resultAbilities, skill) {
    let af = Object.entries(resultAbilities)
        .filter(([id, ability]) =>
            ability.Skill === skill
            //&& ability.Keywords.includes("Calefaction")
            && ability?.Prerequisite == undefined
        )
        .map(([id, ability]) => ({ id, ...ability }))
        .sort((a, b) => (a.Level || 0) - (b.Level || 0));

    console.log(af[4])
    af.forEach(a => {
        //console.log(a.Keywords[2])
        if (a.PvE.Damage != undefined){
            let direct = calculateDirectDamage(a.PvE.Damage, a.Skill, a.DamageType, a.Keywords[2]);
            console.log(`${a.Name}: ${a.PvE.Damage} ${direct}`)
        }
    })

    return af
}

function calculateDirectDamage(baseDamage, skill, damageType, ability){
    let s = skill.toUpperCase()
    let d = damageType.toUpperCase()
    let a = ability.toUpperCase()

    let flat = save.attributes.Flat[s] != undefined ? save.attributes.Flat[s] : 0;
    let flatT = save.attributes.Flat[d] != undefined ? save.attributes.Flat[d] : 0;
    let flatUniversal = save.attributes.Flat["UNIVERSAL"] != undefined ? save.attributes.Flat["UNIVERSAL"] : 0;
    let flatA = save.attributes.FlatA[a] != undefined ? save.attributes.FlatA[a] : 0;

    let mod = save.attributes.Flat[s] != undefined ? save.attributes.Flat[s] : 0;
    let modT = save.attributes.Flat[d] != undefined ? save.attributes.Flat[d] : 0;
    let modUniversal = save.attributes.Flat["UNIVERSAL"] != undefined ? save.attributes.Flat["UNIVERSAL"] : 0;
    let modA = save.attributes.FlatA[a] != undefined ? save.attributes.FlatA[a] : 0;

    let nd = ((baseDamage * (1 + mod + modT + modUniversal + modA)) + ((flat + flatUniversal + flatA + flatT)*(1 + modT + modUniversal + modA)));

    return nd
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