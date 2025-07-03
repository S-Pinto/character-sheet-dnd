// js/storage.js

// NOTA: Non esportiamo più la variabile characterData da qui.

/**
 * Salva un oggetto dato nel localStorage.
 * @param {object} dataToSave L'oggetto dati del personaggio da salvare.
 */
export function saveData(dataToSave) {
  localStorage.setItem("dndCharacterSheet", JSON.stringify(dataToSave));
  const feedback = document.getElementById("save-feedback");
  feedback.textContent = "Salvato!";
  feedback.classList.add("visible");
  setTimeout(() => feedback.classList.remove("visible"), 2000);
}

/**
 * Carica i dati del personaggio. Prima prova dal localStorage,
 * altrimenti carica dal file JSON di default.
 * @returns {Promise<object>} I dati del personaggio caricati.
 */
export async function loadData() {
  try {
    const savedData = localStorage.getItem("dndCharacterSheet");
    if (savedData) {
      console.log("Dati caricati da localStorage.");
      return JSON.parse(savedData);
    }

    // PERCORSO CORRETTO: relativo alla posizione di index.html
    const response = await fetch("data/valenor.json"); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const characterData = await response.json();
    console.log("Dati caricati dal file JSON di default.");
    return characterData;

  } catch (error) {
    console.error("Impossibile caricare i dati del personaggio:", error);
    alert("Errore: impossibile caricare i dati di base del personaggio.");
    return {}; // Ritorna un oggetto vuoto per evitare che l'app si rompa
  }
}