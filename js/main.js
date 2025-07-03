import { loadData, saveData } from "./storage.js";
import * as ui from "./ui.js";

let characterData = {};
let isEditMode = false;

function handleInteraction(e) {
  const target = e.target;
  let stateChanged = false;

  const healBtn = target.closest("#heal-btn");
  const damageBtn = target.closest("#damage-btn");
  const tempHpBtn = target.closest("[data-hp-type='temp']");
  const hitDiceIcon = target.closest(".hit-dice-icon");
  const deathSaveIcon = target.closest(".skull-icon");
  const spellTracker = target.closest('.tracker-dot[data-type="spell"]');
  const customTracker = target.closest('.tracker-dot[data-type="custom"]');
  const longRestBtn = target.closest("#long-rest-btn");
  const preparedToggle = target.closest(".prepared-toggle");
  const addBtn = target.closest(".add-btn");
  const deleteBtn = target.closest(".delete-btn");

  if (healBtn || damageBtn) {
    const val = parseInt(document.getElementById("hp-change-value").value, 10);
    if (damageBtn) {
      let damageToDeal = val;
      if (characterData.hp.temp > 0) {
        if (damageToDeal <= characterData.hp.temp) {
          characterData.hp.temp -= damageToDeal;
          damageToDeal = 0;
        } else {
          damageToDeal -= characterData.hp.temp;
          characterData.hp.temp = 0;
        }
      }
      if (damageToDeal > 0) {
        characterData.hp.current = Math.max(0, characterData.hp.current - damageToDeal);
      }
    } else {
      characterData.hp.current = Math.min(characterData.hp.max, characterData.hp.current + val);
    }
    stateChanged = true;
  }
  else if (tempHpBtn) {
    const amount = parseInt(tempHpBtn.dataset.amount, 10);
    characterData.hp.temp = Math.max(0, characterData.hp.temp + amount);
    stateChanged = true;
  }
  else if (hitDiceIcon) {
    const index = parseInt(hitDiceIcon.dataset.index, 10);
    characterData.hitDice.diceStates[index] = !characterData.hitDice.diceStates[index];
    stateChanged = true;
  }
  else if (deathSaveIcon) {
    const type = deathSaveIcon.dataset.dsType;
    const key = type === 'success' ? 'successes' : 'failures';
    const index = parseInt(deathSaveIcon.dataset.index, 10);
    characterData.deathSaves[key] = (characterData.deathSaves[key] === index + 1) ? index : index + 1;
    stateChanged = true;
  }
  else if (spellTracker) {
    const level = spellTracker.dataset.level;
    const slots = characterData.spells.slots[level];
    slots.used = (slots.used < slots.total) ? slots.used + 1 : 0;
    stateChanged = true;
  }
  else if (customTracker) {
    const index = parseInt(customTracker.dataset.index, 10);
    const tracker = characterData.spells.customTrackers[index];
    tracker.used = (tracker.used < tracker.max) ? tracker.used + 1 : 0;
    stateChanged = true;
  }
  else if (longRestBtn) {
    if (confirm("Recuperare tutti gli slot incantesimo, gli hp e metà dei dadi vita?")) {
        characterData.hp.current = characterData.hp.max;
        characterData.hitDice.diceStates.fill(false);
        for (const level in characterData.spells.slots) {
            characterData.spells.slots[level].used = 0;
        }
        for (const tracker of characterData.spells.customTrackers) {
            tracker.used = 0;
        }
        stateChanged = true;
    }
  }
  else if (preparedToggle) {
    const index = parseInt(preparedToggle.dataset.prepareIndex, 10);
    if (characterData.spells.list[index]) {
        characterData.spells.list[index].prepared = !characterData.spells.list[index].prepared;
        stateChanged = true;
    }
  }
  else if (addBtn) {
    const type = addBtn.dataset.type;
    if (type === 'spells.list') { characterData.spells.list.push({ name: "Nuovo Incantesimo", level: 1, school: "N/A", castingTime: "1 Azione", range: "N/A", duration: "Istantanea", components: "V,S,M", description: "", prepared: true }); }
    else if (type === 'spells.slots') { const level = prompt("Nuovo livello di slot (1-9):"); if (level && !characterData.spells.slots[level]) { characterData.spells.slots[level] = { total: 1, used: 0 }; } }
    else if (type === 'spells.customTrackers') { characterData.spells.customTrackers.push({ name: "Nuovo Contatore", max: 1, used: 0 }); }
    else if (type === 'attacks') { characterData.attacks.push({ name: "Nuovo Attacco", bonus: "+0", damage: "1d4", notes: "" }); }
    else if (type === 'features') { characterData.features.push({ name: "Nuovo Privilegio", description: "Descrizione..." }); }
    else if (type === 'equipment') { characterData.equipment.push({ name: "Nuovo Oggetto", quantity: 1 }); }
    stateChanged = true;
  }
  else if (deleteBtn) {
    if (confirm("Sei sicuro di voler eliminare questo elemento?")) {
        const type = deleteBtn.dataset.type;
        const key = deleteBtn.dataset.level || deleteBtn.dataset.index;
        if (type === 'spells.slots') {
            delete characterData.spells.slots[key];
        } else {
            const list = type.split('.').reduce((o, i) => o[i], characterData);
            list.splice(key, 1);
        }
        stateChanged = true;
    }
  }

  if (stateChanged) {
    saveData(characterData);
    ui.renderSheet(characterData);
  }

  const filterBtn = target.closest(".filter-btn");
  const spellCardHeader = target.closest(".spell-card-header");
  if (filterBtn) {
    ui.setSpellFilter(filterBtn.dataset.filter);
    ui.renderSpells(characterData.spells);
  } else if (spellCardHeader && !addBtn && !deleteBtn && !preparedToggle) {
      spellCardHeader.parentElement.classList.toggle("expanded");
  }
}

function gatherDataFromUI() {
    document.querySelectorAll("[data-path]").forEach((el) => {
        const path = el.dataset.path.split(".");
        let current = characterData;
        for (let i = 0; i < path.length - 1; i++) { current = current[path[i]]; }
        const value = el.type === 'number' ? parseInt(el.value, 10) || 0 : el.value;
        current[path[path.length - 1]] = value;
    });
    document.querySelectorAll(".skill-prof.edit-item").forEach((el) => {
        const key = el.dataset.skill;
        const type = el.dataset.type;
        if (type === 'save') { characterData.savingThrows[key] = el.checked; }
        else { characterData.skills[key].proficient = el.checked; }
    });
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  if (!isEditMode) {
    gatherDataFromUI();
    saveData(characterData);
  }
  ui.setEditMode(isEditMode);
  ui.renderSheet(characterData);
}

function setupSmoothScrolling() {
  document.querySelectorAll('#navbar-shortcuts a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

async function init() {
  setupSmoothScrolling();
  
  characterData = await loadData();
  console.log("--- STATO INIZIALE CARICATO ---", JSON.parse(JSON.stringify(characterData)));

  ui.setEditMode(isEditMode);
  ui.renderSheet(characterData);

  document.getElementById("edit-mode-btn").addEventListener("click", toggleEditMode);
  document.body.addEventListener("click", handleInteraction);
  
  document.body.addEventListener("input", (e) => {
    if (isEditMode && e.target.matches('[data-path^="abilities."]')) {
      const key = e.target.dataset.path.split(".")[1];
      characterData.abilities[key] = parseInt(e.target.value, 10) || 0;
      ui.renderSheet(characterData);
      saveData(characterData);
    }
  });
}

init();