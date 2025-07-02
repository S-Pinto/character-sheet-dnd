// js/ui.js

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

// Funzione principale di rendering, orchestra tutte le altre
export function renderSheet(characterData) {
  if (!characterData || Object.keys(characterData).length === 0) {
    console.error("Dati del personaggio non validi o mancanti per il render.");
    return;
  }
  renderHeader(characterData);
  renderKeyStats(characterData);
  renderAbilities(characterData);
  renderCombatStats(characterData);
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

export function renderKeyStats({ level, proficiencyBonus }) {
  document.getElementById("key-stats-container").innerHTML = `<div class="key-stat-box"><span class="stat-label">Livello Personaggio</span><span class="stat-value view-item">${level}</span><input class="stat-value edit-item" type="number" data-path="level" value="${level}"></div><div class="key-stat-box"><span class="stat-label">Bonus Competenza</span><span class="stat-value view-item">+${proficiencyBonus}</span><input class="stat-value edit-item" type="number" data-path="proficiencyBonus" value="${proficiencyBonus}"></div>`;
}

export function renderAbilities({ abilities, savingThrows, skills, proficiencyBonus }) {
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

export function renderCombatStats({ abilities, ac, speed, hp, hitDice, deathSaves }) {
    const initiative = Math.floor((abilities.dex - 10) / 2);
    document.getElementById("ac-box").innerHTML = `<span class="stat-value view-item">${ac}</span><input type="number" class="stat-value edit-item" data-path="ac" value="${ac}"><span class="stat-label">Classe Armatura</span>`;
    document.getElementById("initiative-box").innerHTML = `<span class="stat-value">${initiative >= 0 ? "+" : ""}${initiative}</span><span class="stat-label">Iniziativa</span>`;
    document.getElementById("speed-box").innerHTML = `<span class="stat-value view-item">${speed}</span><input type="text" class="stat-value edit-item" data-path="speed" value="${speed}"><span class="stat-label">Velocità</span>`;
    document.getElementById("hp-box").innerHTML = `<h4>Punti Vita</h4><div id="hp-layout"><div class="hp-current-side"><div class="current-hp-value">${hp.current}</div><div class="stat-label">Punti Vita Attuali</div><div id="hp-controls"><input type="number" id="hp-change-value" value="1"><button id="heal-btn" class="btn">Cura</button><button id="damage-btn" class="btn">Danno</button></div></div><div class="hp-max-temp-side"><div class="hp-sub-box"><div class="stat-value view-item">${hp.max}</div><input type="number" class="stat-value edit-item" data-path="hp.max" value="${hp.max}"><div class="stat-label">HP Massimi</div></div><div class="hp-sub-box"><div class="stat-value">${hp.temp}</div><div class="stat-label">HP Temporanei</div><div><button class="btn btn-small" data-hp-type="temp" data-amount="-1">-1</button><button class="btn btn-small" data-hp-type="temp" data-amount="1">+1</button></div></div></div></div>`;
    
    const hitDiceBox = document.getElementById("hit-dice-box");
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
    let dieButtonsHTML = "";
    dieTypes.forEach(type => {
        dieButtonsHTML += `<button class="btn btn-small ${hitDice.type === type ? "active" : ""}" data-hd-type-change="${type}">${type}</button>`;
    });
    editContent.innerHTML = `<div class="control-group"><label>Num. Dadi</label><div><button class="btn btn-small" data-hd-total-change="-1">-</button><span style="padding: 0 10px; font-weight: bold;">${hitDice.total}</span><button class="btn btn-small" data-hd-total-change="1">+</button></div></div><div class="control-group"><label>Tipo Dado</label><div class="die-type-buttons">${dieButtonsHTML}</div></div>`;
    hitDiceBox.appendChild(editContent);
    
    let dsHTML = `<h4>Tiri Salvezza vs Morte</h4>`;
    const deathSavesData = [["Successi", "success", deathSaves.successes], ["Fallimenti", "failure", deathSaves.failures]];
    deathSavesData.forEach(([label, type, count]) => {
        dsHTML += `<div class="death-save"><span>${label}</span><div class="tracker-grid">`;
        for (let i = 0; i < 3; i++) {
            dsHTML += `<span class="skull-icon ${i < count ? "toggled " + type : ""}" data-type="ds" data-ds-type="${type}" data-index="${i}">💀</span>`;
        }
        dsHTML += `</div></div>`;
    });
    document.getElementById("death-saves-box").innerHTML = dsHTML;
}

function renderAttacks(attacks) {
    const c = document.getElementById("attacks-box");
    let h = `<h2>Attacchi</h2><div id="attacks-container">`;
    attacks.forEach((a, i) => {
        h += `<div class="attack-card"><div class="view-item"><h4>${a.name}</h4><div class="attack-stats"><span><strong>Bonus:</strong> ${a.bonus}</span><span><strong>Danno:</strong> ${a.damage}</span></div><div class="attack-notes">${a.notes}</div></div><div class="edit-item"><input type="text" data-path="attacks.${i}.name" value="${a.name}" placeholder="Nome Attacco"><div style="display:flex;gap:1rem;margin:0.5rem 0;"><input type="text" data-path="attacks.${i}.bonus" value="${a.bonus}" placeholder="Bonus"><input type="text" data-path="attacks.${i}.damage" value="${a.damage}" placeholder="Danno"></div><textarea data-path="attacks.${i}.notes">${a.notes}</textarea><button class="delete-btn" data-type="attacks" data-index="${i}">X</button></div></div>`;
    });
    h += `</div><button class="add-btn edit-item" data-type="attacks">+</button>`;
    c.innerHTML = h;
}

function renderEquipment(equipment, coins) {
    let h = `<h2>Equipaggiamento</h2><ul class="item-list">`;
    equipment.forEach((item, index) => {
        h += `<li><div class="view-item">${item.name} (${item.quantity})</div><div class="edit-item" style="display:flex;gap:5px;width:100%;"><input type="text" data-path="equipment.${index}.name" value="${item.name}" placeholder="Oggetto"><input type="number" data-path="equipment.${index}.quantity" value="${item.quantity}" style="flex-basis:70px;"><button class="delete-btn" data-type="equipment" data-index="${index}">X</button></div></li>`;
    });
    h += `</ul><button class="add-btn edit-item" data-type="equipment">+</button>`;
    let c = `<div id="coin-container">`;
    Object.keys(coins).forEach(coin => {
        c += `<div><span class="stat-label">${coin.toUpperCase()}</span><div class="stat-value view-item">${coins[coin]}</div><input type="number" class="stat-value edit-item" data-path="coins.${coin}" value="${coins[coin]}"></div>`;
    });
    document.getElementById("equipment-box").innerHTML = h + c + `</div>`;
}

function renderPersonality({ appearance, backstory }) {
    document.getElementById("personality-box").innerHTML = `<h2>Personalità</h2><h4>Aspetto</h4><p class="view-item">${appearance.replace(/\n/g,"<br>")}</p><textarea class="edit-item" data-path="personality.appearance">${appearance}</textarea><h4>Backstory</h4><p class="view-item">${backstory.replace(/\n/g,"<br>")}</p><textarea class="edit-item" data-path="personality.backstory">${backstory}</textarea>`;
}

function renderFeatures(features) {
    let h = `<h2>Talenti e Privilegi</h2>`;
    features.forEach((f, i) => {
        h += `<div class="feature-item"><div class="view-item"><h4>${f.name}</h4><p>${f.description}</p></div><div class="edit-item"><input type="text" data-path="features.${i}.name" value="${f.name}" placeholder="Nome Privilegio"><textarea data-path="features.${i}.description">${f.description}</textarea><button class="delete-btn" data-type="features" data-index="${i}">X</button></div></div>`;
    });
    h += `<button class="add-btn edit-item" data-type="features">+</button>`;
    document.getElementById("features-box").innerHTML = h;
}

function renderProficiencies({ armor, weapons, tools, languages }) {
    document.getElementById("proficiencies-box").innerHTML = `<h2>Altre Competenze</h2><h4>Armature</h4><p class="view-item">${armor}</p><textarea class="edit-item" data-path="proficiencies.armor">${armor}</textarea><h4>Armi</h4><p class="view-item">${weapons}</p><textarea class="edit-item" data-path="proficiencies.weapons">${weapons}</textarea><h4>Strumenti</h4><p class="view-item">${tools}</p><textarea class="edit-item" data-path="proficiencies.tools">${tools}</textarea><h4>Linguaggi</h4><p class="view-item">${languages}</p><textarea class="edit-item" data-path="proficiencies.languages">${languages}</textarea>`;
}

export function renderSpells(s) {
    const spellModifierValue = s.spellModifier >= 0 ? `+${s.spellModifier}` : s.spellModifier;
    let h = `<h2>Incantesimi</h2><div class="spells-header"><div class="spell-main-stats"><div class="stat-box"><label>Abilità Incantesimi</label><div class="stat-value view-item">${s.ability}</div><input type="text" class="stat-value edit-item" data-path="spells.ability" value="${s.ability}"></div><div class="stat-box"><label>Modificatore Incantesimi</label><div class="stat-value view-item">${spellModifierValue}</div><input type="number" class="stat-value edit-item" data-path="spells.spellModifier" value="${s.spellModifier}"></div><div class="stat-box"><label>CD Salvezza Incantesimi</label><div class="stat-value view-item">${s.saveDC}</div><input type="number" class="stat-value edit-item" data-path="spells.saveDC" value="${s.saveDC}"></div><div class="stat-box"><label>Bonus Attacco Incantesimi</label><div class="stat-value view-item">${s.attackBonus}</div><input type="number" class="stat-value edit-item" data-path="spells.attackBonus" value="${s.attackBonus}"></div></div></div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><h4>Slot Incantesimo</h4><button id="long-rest-btn" class="btn btn-small">Riposo Lungo</button></div><div id="spell-slots-container"></div><button class="add-btn edit-item" data-type="spells.slots">+ Aggiungi Livello Slot</button><h4 style="margin-top:1.5rem;">Contatori Speciali</h4><div id="custom-trackers-container"></div><button class="add-btn edit-item" data-type="spells.customTrackers">+ Aggiungi Contatore</button><h4 style="margin-top:1.5rem;">Lista Incantesimi</h4><div id="spell-filters"></div><div id="spell-card-list"></div><button class="add-btn edit-item" data-type="spells.list">+ Aggiungi Incantesimo</button>`;
    document.getElementById("spells-section-container").innerHTML = h;
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