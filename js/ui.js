// js/ui.js - VERSIONE FINALE E CORRETTA

const SKILL_MAP = {
  str: ["athletics"],
  dex: ["acrobatics", "sleightOfHand", "stealth"],
  int: ["arcana", "history", "investigation", "nature", "religion"],
  wis: ["animalHandling", "insight", "medicine", "perception", "survival"],
  cha: ["deception", "intimidation", "performance", "persuasion"],
};
let spellFilter = "all";

export function setSpellFilter(newFilter) {
  spellFilter = newFilter;
}

export function setEditMode(isEditMode) {
  document.body.classList.toggle("edit-mode", isEditMode);
  document.body.classList.toggle("view-mode", !isEditMode);
  const btn = document.getElementById("edit-mode-btn");
  btn.textContent = isEditMode ? "Salva e Blocca" : "Modifica Scheda";
  btn.classList.toggle("save-btn", isEditMode);
}

export function renderSheet(characterData) {
  if (!characterData || Object.keys(characterData).length === 0) {
    document.body.innerHTML = "<h1>Errore: Impossibile caricare i dati del personaggio.</h1>";
    return;
  }
  renderHeader(characterData);
  renderKeyStats(characterData);
  renderAbilities(characterData);
  renderMainStats(characterData);
  renderHealth(characterData.hp);
  renderResources(characterData.hitDice, characterData.deathSaves);
  renderAttacks(characterData.attacks);
  renderEquipment(characterData.equipment, characterData.coins);
  renderPersonality(characterData.personality);
  renderFeatures(characterData.features);
  renderProficiencies(characterData.proficiencies);
  renderSpells(characterData.spells);
}

function renderHeader({ imageUrl, name, class: className, race, background, alignment }) {
  document.getElementById("portrait-container").innerHTML = `<div class="view-item"><img id="portrait-img" src="${imageUrl}" alt="Ritratto" onerror="this.style.display='none'"></div><div class="edit-item"><img src="${imageUrl}" alt="Ritratto" onerror="this.style.display='none'"><label>URL o nome file</label><input type="text" data-path="imageUrl" value="${imageUrl}"></div>`;
  document.getElementById("character-name-display").innerHTML = `<span class="view-item">${name}</span><input type="text" class="edit-item" data-path="name" value="${name}">`;
  document.getElementById("details-grid").innerHTML = `<div class="detail-box"><label>Classe & Multiclasse</label><div class="view-item">${className}</div><input type="text" class="edit-item" data-path="class" value="${className}"></div><div class="detail-box"><label>Specie</label><div class="view-item">${race}</div><input type="text" class="edit-item" data-path="race" value="${race}"></div><div class="detail-box"><label>Background</label><div class="view-item">${background}</div><input type="text" class="edit-item" data-path="background" value="${background}"></div><div class="detail-box"><label>Allineamento</label><div class="view-item">${alignment}</div><input type="text" class="edit-item" data-path="alignment" value="${alignment}"></div>`;
}

function renderKeyStats({ level, proficiencyBonus }) {
  document.getElementById("key-stats-container").innerHTML = `<div class="key-stat-box"><span class="stat-label">Livello Personaggio</span><span class="stat-value view-item">${level}</span><input class="stat-value edit-item" type="number" data-path="level" value="${level}"></div><div class="key-stat-box"><span class="stat-label">Bonus Competenza</span><span class="stat-value view-item">+${proficiencyBonus}</span><input class="stat-value edit-item" type="number" data-path="proficiencyBonus" value="${proficiencyBonus}"></div>`;
}

function renderAbilities({ abilities, savingThrows, skills, proficiencyBonus }) {
  const container = document.getElementById("abilities-container");
  container.innerHTML = "";
  Object.keys(abilities).forEach((key) => {
    const score = abilities[key];
    const modifier = Math.floor((score - 10) / 2);
    const isSavingThrowProficient = savingThrows[key];
    const savingThrowBonus = modifier + (isSavingThrowProficient ? proficiencyBonus : 0);
    let skillsHTML = '<ul class="skill-list">';
    skillsHTML += `<li style="font-weight: bold; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;"><span class="prof-dot view-item ${isSavingThrowProficient ? "proficient" : ""}"></span><input type="checkbox" class="skill-prof edit-item" data-type="save" data-skill="${key}" ${isSavingThrowProficient ? "checked" : ""}><span class="skill-name">Tiro Salvezza</span><strong>${savingThrowBonus >= 0 ? "+" : ""}${savingThrowBonus}</strong></li>`;
    if (SKILL_MAP[key]) {
      SKILL_MAP[key].forEach((skillKey) => {
        const isProficient = skills[skillKey]?.proficient || false;
        const skillBonus = modifier + (isProficient ? proficiencyBonus : 0);
        skillsHTML += `<li><span class="prof-dot view-item ${isProficient ? "proficient" : ""}"></span><input type="checkbox" class="skill-prof edit-item" data-type="skill" data-skill="${skillKey}" ${isProficient ? "checked" : ""}><span class="skill-name">${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)}</span><strong>${skillBonus >= 0 ? "+" : ""}${skillBonus}</strong></li>`;
      });
    }
    skillsHTML += "</ul>";
    container.innerHTML += `<div class="ability-box"><div class="ability-header"><h3>${key.toUpperCase()}</h3><div class="ability-score view-item">${score}</div><input type="number" class="ability-score edit-item" data-path="abilities.${key}" value="${score}"><div class="ability-modifier">${modifier >= 0 ? "+" : ""}${modifier}</div></div>${skillsHTML}</div>`;
  });
}

function renderMainStats({ abilities, ac, speed }) {
    const initiative = Math.floor((abilities.dex - 10) / 2);
    const container = document.getElementById("main-stats-container");
    if (!container) return;

    // Codice SVG con le coordinate Y invertite per testo e valore
    const shieldSVG = `
        <div class="ac-shield-container">
            <svg class="ac-shield-svg" viewBox="-5 -5 110 120">
                <path class="shield-path" d="M 50,0 L 100,10 L 95,60 C 95,90 50,110 50,110 C 50,110 5,90 5,60 L 0,10 Z" />
                
                <text x="50" y="20" text-anchor="middle" class="shield-text-label">CLASSE</text>
                <text x="50" y="32" text-anchor="middle" class="shield-text-label">ARMATURA</text>

                <text x="50" y="80" text-anchor="middle" class="shield-text-value">${ac}</text>

            </svg>
            <div class="edit-item">
                 <input type="number" class="stat-value" data-path="ac" value="${ac}">
            </div>
        </div>`;

    const initiativeBox = `<div class="flanking-stat-box"><span class="stat-label">Iniziativa</span><span class="stat-value">${initiative >= 0 ? "+" : ""}${initiative}</span></div>`;
    const speedBox = `<div class="flanking-stat-box"><span class="stat-label">Velocità</span><span class="stat-value view-item">${speed}</span><input type="text" class="stat-value edit-item" data-path="speed" value="${speed}"></div>`;
    
    container.innerHTML = initiativeBox + shieldSVG + speedBox;
}

// REPLACE ONLY THIS FUNCTION in js/ui.js

// SOSTITUISCI SOLO QUESTA FUNZIONE in js/ui.js

// SOSTITUISCI SOLO QUESTA FUNZIONE in js/ui.js

function renderHealth(hp) {
    const container = document.getElementById("hp-box");
    if (!container) return;

    const hpPercent = (hp.max > 0) ? (hp.current / hp.max) * 100 : 0;
    const tempHpPercent = (hp.max > 0) ? (hp.temp / hp.max) * 100 : 0;

    let barColor;
    if (hpPercent > 50) { barColor = "var(--c-success)"; }
    else if (hpPercent > 25) { barColor = "#f39c12"; }
    else { barColor = "var(--c-danger)"; }

    container.innerHTML = `
    <div class="hp-container">
        <h4>Punti Ferita</h4>

        <div class="hp-sub-stats">
             <div>
                HP Massimi: 
                <span class="view-item">${hp.max}</span>
                <input type="number" class="edit-item" data-path="hp.max" value="${hp.max}" style="width: 60px; text-align: center;">
             </div>
        </div>

        <div class="hp-display">
            <svg class="hp-heart-icon" viewBox="-2 -2 28 28">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="hp-text">${hp.current}</span>
        </div>

        <div class="hp-bar-container">
            <div class="hp-bar-fill" style="width: ${hpPercent}%; background-color: ${barColor};"></div>
        </div>
        
        <div class="hp-sub-stats" style="margin-top: 0.5rem;">
            <div class="temp-hp-container">
                HP Temporanei: <span>${hp.temp}</span>
                <div class="temp-hp-controls">
                    <button class="btn-small" data-hp-type="temp" data-amount="-1">-</button>
                    <button class="btn-small" data-hp-type="temp" data-amount="1">+</button>
                </div>
            </div>
        </div>

        <div class="temp-hp-bar-container">
            <div class="temp-hp-bar-fill" style="width: ${tempHpPercent}%;"></div>
        </div>

        <div class="hp-controls">
            <button id="damage-btn" class="hp-control-btn damage" title="Danno">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" transform="rotate(45 12 12)"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </button>
            <input type="number" id="hp-change-value" value="1" min="1">
            <button id="heal-btn" class="hp-control-btn heal" title="Cura">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 .98.22 1.91.62 2.75L12 21.35l9.38-10.1C21.78 10.41 22 9.48 22 8.5 22 5.42 19.58 3 16.5 3zM18 10h-3V7h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>
            </button>
        </div>
    </div>`;
}

function renderResources(hitDice, deathSaves) {
    const hitDiceBox = document.getElementById("hit-dice-box");
    if (hitDiceBox) {
        hitDiceBox.innerHTML = `<h4>Dadi Vita</h4>`;
        const viewContent = document.createElement("div");
        viewContent.className = "view-item";
        let viewHeartsHTML = "";
        hitDice.diceStates.forEach((isUsed, index) => {
            viewHeartsHTML += `<span class="hit-dice-icon ${isUsed ? "used" : ""}" data-type="hd" data-index="${index}">❤️</span>`;
        });
        viewContent.innerHTML = `<div style="text-align:center; color: var(--c-label); margin-bottom: 1rem;">Lancia 1${hitDice.type}</div><div class="tracker-grid">${viewHeartsHTML}</div>`;
        hitDiceBox.appendChild(viewContent);
        const editContent = document.createElement("div");
        editContent.className = "edit-item edit-item-controls";
        let dieTypes = ["d6", "d8", "d10", "d12"];
        editContent.innerHTML = `<div class="control-group"><label>Num. Dadi</label><div><button class="btn btn-small" data-hd-total-change="-1">-</button><span style="padding: 0 10px; font-weight: bold;">${hitDice.total}</span><button class="btn btn-small" data-hd-total-change="1">+</button></div></div><div class="control-group"><label>Tipo Dado</label><div class="die-type-buttons">${dieTypes.map(type => `<button class="btn btn-small ${hitDice.type === type ? "active" : ""}" data-hd-type-change="${type}">${type}</button>`).join('')}</div></div>`;
        hitDiceBox.appendChild(editContent);
    }
    const deathSavesBox = document.getElementById("death-saves-box");
    if (deathSavesBox) {
        let dsHTML = `<h4>Tiri Salvezza vs Morte</h4>`;
        const deathSavesData = [["Successi", "success", deathSaves.successes], ["Fallimenti", "failure", deathSaves.failures]];
        deathSavesData.forEach(([label, type, count]) => {
            dsHTML += `<div class="death-save"><span>${label}</span><div class="tracker-grid">${[...Array(3)].map((_, i) => `<span class="skull-icon ${i < count ? "toggled " + type : ""}" data-type="ds" data-ds-type="${type}" data-index="${i}">💀</span>`).join('')}</div></div>`;
        });
        deathSavesBox.innerHTML = dsHTML;
    }
}

function renderAttacks(attacks) {
  const c = document.getElementById("attacks-box");
  c.innerHTML = `<h2>Attacchi</h2><div id="attacks-container">${attacks.map((a,i) => `<div class="attack-card"><div class="view-item"><h4>${a.name}</h4><div class="attack-stats"><span><strong>Bonus:</strong> ${a.bonus}</span><span><strong>Danno:</strong> ${a.damage}</span></div><div class="attack-notes">${a.notes}</div></div><div class="edit-item"><input type="text" data-path="attacks.${i}.name" value="${a.name}" placeholder="Nome Attacco"><div style="display:flex;gap:1rem;margin:0.5rem 0;"><input type="text" data-path="attacks.${i}.bonus" value="${a.bonus}" placeholder="Bonus"><input type="text" data-path="attacks.${i}.damage" value="${a.damage}" placeholder="Danno"></div><textarea data-path="attacks.${i}.notes">${a.notes}</textarea><button class="delete-btn" data-type="attacks" data-index="${i}">X</button></div></div>`).join('')}</div><button class="add-btn edit-item" data-type="attacks">+</button>`;
}

function renderEquipment(equipment, coins) {
    const h = `<h2>Equipaggiamento</h2><ul class="item-list">${equipment.map((item, index) => `<li><div class="view-item">${item.name} (${item.quantity})</div><div class="edit-item" style="display:flex;gap:5px;width:100%;"><input type="text" data-path="equipment.${index}.name" value="${item.name}" placeholder="Oggetto"><input type="number" data-path="equipment.${index}.quantity" value="${item.quantity}" style="flex-basis:70px;"><button class="delete-btn" data-type="equipment" data-index="${index}">X</button></div></li>`).join('')}</ul><button class="add-btn edit-item" data-type="equipment">+</button>`;
    const c = `<div id="coin-container">${Object.keys(coins).map(coin => `<div><span class="stat-label">${coin.toUpperCase()}</span><div class="stat-value view-item">${coins[coin]}</div><input type="number" class="stat-value edit-item" data-path="coins.${coin}" value="${coins[coin]}"></div>`).join('')}</div>`;
    document.getElementById("equipment-box").innerHTML = h + c;
}

function renderPersonality({ appearance, backstory }) {
    document.getElementById("personality-box").innerHTML = `<h2>Personalità</h2><h4>Aspetto</h4><p class="view-item">${appearance.replace(/\n/g,"<br>")}</p><textarea class="edit-item" data-path="personality.appearance">${appearance}</textarea><h4>Backstory</h4><p class="view-item">${backstory.replace(/\n/g,"<br>")}</p><textarea class="edit-item" data-path="personality.backstory">${backstory}</textarea>`;
}

function renderFeatures(features) {
    document.getElementById("features-box").innerHTML = `<h2>Talenti e Privilegi</h2>${features.map((f, i) => `<div class="feature-item"><div class="view-item"><h4>${f.name}</h4><p>${f.description}</p></div><div class="edit-item"><input type="text" data-path="features.${i}.name" value="${f.name}" placeholder="Nome Privilegio"><textarea data-path="features.${i}.description">${f.description}</textarea><button class="delete-btn" data-type="features" data-index="${i}">X</button></div></div>`).join('')}<button class="add-btn edit-item" data-type="features">+</button>`;
}

function renderProficiencies({ armor, weapons, tools, languages }) {
    document.getElementById("proficiencies-box").innerHTML = `<h2>Altre Competenze</h2><h4>Armature</h4><p class="view-item">${armor}</p><textarea class="edit-item" data-path="proficiencies.armor">${armor}</textarea><h4>Armi</h4><p class="view-item">${weapons}</p><textarea class="edit-item" data-path="proficiencies.weapons">${weapons}</textarea><h4>Strumenti</h4><p class="view-item">${tools}</p><textarea class="edit-item" data-path="proficiencies.tools">${tools}</textarea><h4>Linguaggi</h4><p class="view-item">${languages}</p><textarea class="edit-item" data-path="proficiencies.languages">${languages}</textarea>`;
}


export function renderSpells(s) {
    const container = document.getElementById("spells-section-container");
    if (!container) return;

    const spellModifierValue = s.spellModifier >= 0 ? `+${s.spellModifier}` : s.spellModifier;
    
    let headerHTML = `
        <h2>Incantesimi</h2>
        <div class="spells-header">
            <div class="spell-main-stats">
                <div class="stat-box"><label>Abilità Incantesimi</label><div class="stat-value view-item">${s.ability}</div><input type="text" class="stat-value edit-item" data-path="spells.ability" value="${s.ability}"></div>
                <div class="stat-box"><label>Modificatore Incantesimi</label><div class="stat-value view-item">${spellModifierValue}</div><input type="number" class="stat-value edit-item" data-path="spells.spellModifier" value="${s.spellModifier}"></div>
                <div class="stat-box"><label>CD Salvezza Incantesimi</label><div class="stat-value view-item">${s.saveDC}</div><input type="number" class="stat-value edit-item" data-path="spells.saveDC" value="${s.saveDC}"></div>
                <div class="stat-box"><label>Bonus Attacco Incantesimi</label><div class="stat-value view-item">${s.attackBonus}</div><input type="number" class="stat-value edit-item" data-path="spells.attackBonus" value="${s.attackBonus}"></div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <h4>Slot Incantesimo</h4>
            <button id="long-rest-btn" class="btn btn-small">Riposo Lungo</button>
        </div>
        <div id="spell-slots-container"></div>
        <button class="add-btn edit-item" data-type="spells.slots">+ Aggiungi Livello Slot</button>
        <h4 style="margin-top:1.5rem;">Contatori Speciali</h4>
        <div id="custom-trackers-container"></div>
        <button class="add-btn edit-item" data-type="spells.customTrackers">+ Aggiungi Contatore</button>
        <h4 style="margin-top:1.5rem;">Lista Incantesimi</h4>
        <div id="spell-filters"></div>
        <div id="spell-card-list"></div>
        <button class="add-btn edit-item" data-type="spells.list">+ Aggiungi Incantesimo</button>
    `;
    container.innerHTML = headerHTML;

    const slotsContainer = document.getElementById("spell-slots-container");
    slotsContainer.innerHTML = "";
    Object.entries(s.slots).sort((a, b) => a[0] - b[0]).forEach(([lvl, data]) => {
        let slotHTML = `<div class="spell-slot-row"><strong class="slot-label">Livello ${lvl}</strong><div class="edit-item slot-controls"><button class="btn btn-small" data-slot-change="${lvl}" data-amount="-1">-</button><span>${data.total}</span><button class="btn btn-small" data-slot-change="${lvl}" data-amount="1">+</button></div><div class="tracker-grid">`;
        for (let i = 0; i < data.total; i++)
            slotHTML += `<div class="tracker-dot ${i < data.used ? 'used' : ''}" data-type="spell" data-level="${lvl}"></div>`;
        slotsContainer.innerHTML += slotHTML + `<button class="delete-btn edit-item" data-type="spells.slots" data-level="${lvl}">X</button></div>`;
    });

    const customTrackersContainer = document.getElementById("custom-trackers-container");
    customTrackersContainer.innerHTML = "";
    s.customTrackers.forEach((tracker, index) => {
        let trackerHTML = `<div class="spell-slot-row"><div class="slot-label view-item">${tracker.name}</div><input class="slot-label edit-item" data-path="spells.customTrackers.${index}.name" value="${tracker.name}"><div class="edit-item slot-controls"><button class="btn btn-small" data-custom-tracker-change="${index}" data-amount="-1">-</button><span>${tracker.max}</span><button class="btn btn-small" data-custom-tracker-change="${index}" data-amount="1">+</button></div><div class="tracker-grid">`;
        for (let i = 0; i < tracker.max; i++)
            trackerHTML += `<div class="tracker-dot ${i < tracker.used ? 'used' : ''}" data-type="custom" data-index="${index}"></div>`;
        customTrackersContainer.innerHTML += `<div style="width:100%">${trackerHTML}</div><button class="delete-btn edit-item" data-type="spells.customTrackers" data-index="${index}">X</button></div>`;
    });

    const filtersContainer = document.getElementById("spell-filters");
    const levels = [...new Set(s.list.map(spell => spell.level))].sort((a, b) => a - b);
    let filtersHTML = `<button class="btn btn-small filter-btn ${spellFilter === "all" ? "active" : ""}" data-filter="all">Tutti</button> <button class="btn btn-small filter-btn ${spellFilter === "prepared" ? "active" : ""}" data-filter="prepared">Preparati</button>`;
    levels.forEach(level => {
        filtersHTML += `<button class="btn btn-small filter-btn ${spellFilter == level ? "active" : ""}" data-filter="${level}">${level === 0 ? "Trucchetti" : `Lvl ${level}`}</button>`;
    });
    filtersContainer.innerHTML = filtersHTML;

    const cardListContainer = document.getElementById("spell-card-list");
    cardListContainer.innerHTML = "";
    s.list.filter(spell => {
        if (spellFilter === "all") return true;
        if (spellFilter === "prepared") return spell.prepared;
        return spell.level == spellFilter;
    }).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)).forEach((spell) => {
        const originalIndex = s.list.findIndex(s_find => s_find.name === spell.name && s_find.level === spell.level);
        let cardHTML = `<div class="spell-card"><div class="spell-card-header" data-card-index="${originalIndex}"><div class="spell-level">${spell.level === 0 ? "C" : spell.level}</div><div class="spell-name view-item">${spell.name}</div><input type="text" class="spell-name edit-item" data-path="spells.list.${originalIndex}.name" value="${spell.name}"><div class="spell-tags">${spell.isConcentration ? '<span class="spell-tag">C</span>' : ""}${spell.isRitual ? '<span class="spell-tag">R</span>' : ""}</div></div><div class="spell-card-body"><div class="spell-body-main-grid"><div class="spell-details-grid"><div class="spell-detail"><label>Tempo di Lancio</label><p class="view-item">${spell.castingTime}</p><input class="edit-item" data-path="spells.list.${originalIndex}.castingTime" value="${spell.castingTime}"></div><div class="spell-detail"><label>Gittata</label><p class="view-item">${spell.range}</p><input class="edit-item" data-path="spells.list.${originalIndex}.range" value="${spell.range}"></div><div class="spell-detail"><label>Durata</label><p class="view-item">${spell.duration}</p><input class="edit-item" data-path="spells.list.${originalIndex}.duration" value="${spell.duration}"></div><div class="spell-detail"><label>Componenti</label><p class="view-item">${spell.components}</p><input class="edit-item" data-path="spells.list.${originalIndex}.components" value="${spell.components}"></div></div><div class="spell-side-info"><div class="spell-detail"><label>Scuola</label><p class="view-item">${spell.school}</p><input class="edit-item" data-path="spells.list.${originalIndex}.school" value="${spell.school}"></div><div class="spell-detail"><label>Preparato</label><span class="prepared-toggle ${spell.prepared ? "prepared" : ""}" data-prepare-index="${originalIndex}" title="Preparato">📖</span></div></div></div><label>Descrizione</label><p class="view-item">${(spell.description || "").replace(/\n/g,"<br>")}</p><textarea class="edit-item" data-path="spells.list.${originalIndex}.description">${spell.description}</textarea><button class="delete-btn edit-item" data-type="spells.list" data-index="${originalIndex}">X</button></div></div>`;
        cardListContainer.innerHTML += cardHTML;
    });
}