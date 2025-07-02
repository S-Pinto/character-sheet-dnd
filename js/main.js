// js/main.js

import { loadData, saveData } from "./storage.js";
import * as ui from "./ui.js";

// L'UNICA "FONTE DI VERITÀ" PER I DATI DELL'APP
let characterData = {};
let isEditMode = false;

/**
 * Gestisce tutte le interazioni dell'utente catturate dal body.
 * Modifica lo stato (characterData) e poi chiama le funzioni di UI per aggiornare la vista.
 * @param {Event} e L'oggetto evento del DOM.
 */
function handleInteraction(e) {
  const target = e.target;
  let renderAll = false; // Flag per decidere se fare un render completo

  // Aggiungi item
  if (target.matches(".add-btn")) {
    const type = target.dataset.type;
    if (type === "attacks") {
      characterData.attacks.push({ name: "Nuovo Attacco", bonus: "+0", damage: "1d4", notes: "" });
    } else if (type === "equipment") {
      characterData.equipment.push({ name: "Nuovo Oggetto", quantity: 1 });
    } else if (type === "features") {
      characterData.features.push({ name: "Nuovo Privilegio", description: "Descrizione..." });
    }
    //... Altri 'add' types...
    renderAll = true;
  }

  // Elimina item
  else if (target.matches(".delete-btn")) {
    const type = target.dataset.type;
    const indexOrLevel = target.dataset.index || target.dataset.level;
    if (type === "spells.slots") {
      if (confirm(`Sei sicuro di voler eliminare gli slot di Livello ${indexOrLevel}?`)) {
        delete characterData.spells.slots[indexOrLevel];
        ui.renderSpells(characterData.spells);
      }
      return;
    }
    const list = type.split(".").reduce((o, i) => o[i], characterData);
    list.splice(indexOrLevel, 1);
    renderAll = true;
  }

  // Usa slot e contatori (richiedono solo render parziali)
  else if (target.matches('.tracker-dot[data-type="custom"]')) {
    const index = parseInt(target.dataset.index, 10);
    const tracker = characterData.spells.customTrackers[index];
    tracker.used = (tracker.used < tracker.max) ? tracker.used + 1 : 0;
    ui.renderSpells(characterData.spells);
    return;
  } else if (target.matches('.tracker-dot[data-type="spell"]')) {
    const level = target.dataset.level;
    const slots = characterData.spells.slots[level];
    slots.used = (slots.used < slots.total) ? slots.used + 1 : 0;
    ui.renderSpells(characterData.spells);
    return;
  }

  // Altre interazioni che richiedono solo render parziali
  else if (target.matches(".hit-dice-icon")) {
    const index = parseInt(target.dataset.index, 10);
    characterData.hitDice.diceStates[index] = !characterData.hitDice.diceStates[index];
    ui.renderCombatStats(characterData);
    return;
  } else if (target.matches('[data-hp-type="temp"]')) {
    const amount = parseInt(target.dataset.amount, 10);
    characterData.hp.temp = Math.max(0, characterData.hp.temp + amount);
    ui.renderCombatStats(characterData);
    return;
  } else if (target.matches(".skull-icon")) {
    const type = target.dataset.dsType;
    const key = type + "es";
    const index = parseInt(target.dataset.index, 10);
    characterData.deathSaves[key] = (characterData.deathSaves[key] === index + 1) ? index : index + 1;
    ui.renderCombatStats(characterData);
    return;
  } else if (target.id === "heal-btn" || target.id === "damage-btn") {
    const val = parseInt(document.getElementById("hp-change-value").value, 10);
    characterData.hp.current = target.id === 'heal-btn'
      ? Math.min(characterData.hp.max, characterData.hp.current + val)
      : Math.max(0, characterData.hp.current - val);
    ui.renderCombatStats(characterData);
    return;
  }

  // Interazioni degli incantesimi
  else if (target.matches(".filter-btn")) {
    ui.setSpellFilter(target.dataset.filter);
    ui.renderSpells(characterData.spells);
    return;
  } else if (target.closest(".spell-card-header") && !target.matches(".prepared-toggle")) {
    target.closest(".spell-card").classList.toggle("expanded");
  } else if (target.matches(".prepared-toggle")) {
      const index = parseInt(target.dataset.prepareIndex, 10);
      characterData.spells.list[index].prepared = !characterData.spells.list[index].prepared;
      target.classList.toggle("prepared");
  }

  if (renderAll) {
    ui.renderSheet(characterData);
  }
}

/**
 * Raccoglie tutti i dati modificabili dall'interfaccia utente (quando in edit-mode)
 * e aggiorna l'oggetto characterData.
 */
function gatherDataFromUI() {
    document.querySelectorAll("[data-path]").forEach((el) => {
        const path = el.dataset.path.split(".");
        let current = characterData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        const value = el.type === 'number' ? parseInt(el.value, 10) || 0 : el.value;
        current[path[path.length - 1]] = value;
    });

    document.querySelectorAll(".skill-prof.edit-item").forEach((el) => {
        const key = el.dataset.skill;
        const type = el.dataset.type;
        if (type === 'save') {
            characterData.savingThrows[key] = el.checked;
        } else {
            characterData.skills[key].proficient = el.checked;
        }
    });
}

/**
 * Gestisce l'attivazione/disattivazione della modalità di modifica.
 * Salva i dati quando si esce dalla modalità di modifica.
 */
function toggleEditMode() {
  isEditMode = !isEditMode;

  if (!isEditMode) {
    // Se stiamo uscendo dalla modalità modifica, raccogli i dati e salva
    gatherDataFromUI();
    saveData(characterData);
  }

  ui.setEditMode(isEditMode);
  ui.renderSheet(characterData);
}

/**
 * Funzione di inizializzazione dell'applicazione.
 */
async function init() {
  characterData = await loadData();
  ui.setEditMode(isEditMode);
  ui.renderSheet(characterData);

  document.getElementById("edit-mode-btn").addEventListener("click", toggleEditMode);
  document.body.addEventListener("click", handleInteraction);
  
  // Listener specifico per l'input per un feedback immediato (es. modificatori)
  document.body.addEventListener("input", (e) => {
    if (isEditMode && e.target.matches('[data-path^="abilities."]')) {
      const key = e.target.dataset.path.split(".")[1];
      characterData.abilities[key] = parseInt(e.target.value, 10) || 0;
      // Aggiorna solo la sezione abilità per migliore performance
      ui.renderAbilities(characterData);
    }
  });
}

// Avvia l'applicazione
init();