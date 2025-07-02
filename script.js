document.addEventListener("DOMContentLoaded", () => {
  let characterData = {
    name: "Valenor Lightbringer",
    class: "Paladino 5 / Warlock 1",
    level: 6,
    background: "Soldato",
    race: "Aasimar",
    alignment: "Neutrale Buono",
    ac: 18,
    speed: "30ft",
    hp: { max: 60, current: 60, temp: 0 },
    hitDice: {
      total: 5,
      type: "d10",
      diceStates: [false, false, false, false, false],
    },
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 3,
    abilities: { str: 17, dex: 10, con: 14, int: 8, wis: 12, cha: 15 },
    savingThrows: {
      str: true,
      dex: false,
      con: true,
      int: false,
      wis: true,
      cha: true,
    },
    skills: {
      athletics: { proficient: true },
      acrobatics: { proficient: false },
      sleightOfHand: { proficient: false },
      stealth: { proficient: false },
      arcana: { proficient: false },
      history: { proficient: false },
      investigation: { proficient: false },
      nature: { proficient: false },
      religion: { proficient: false },
      animalHandling: { proficient: false },
      insight: { proficient: true },
      medicine: { proficient: false },
      perception: { proficient: false },
      survival: { proficient: false },
      deception: { proficient: false },
      intimidation: { proficient: true },
      performance: { proficient: false },
      persuasion: { proficient: true },
    },
    proficiencies: {
      armor: "Armature Leggere, Medie, Pesanti, Scudi",
      weapons: "Armi Semplici, Armi da Guerra",
      tools: "Set da Gioco (dadi)",
      languages: "Comune, Celestiale, Orchesco",
    },
    attacks: [
      {
        name: "Egen-Vath",
        bonus: "+7",
        damage: "2d6s + 1d4f + 4",
        notes:
          "Se l'attacco manca, l'avversario subisce comunque 3 danni da fuoco.",
      },
      {
        name: "Spada Lunga (+1)",
        bonus: "+7",
        damage: "1d8+6 Tagliente",
        notes: "Stile Duellare (+2 danni) attivo.",
      },
      {
        name: "Eldritch Blast",
        bonus: "+5",
        damage: "2d10 Forza",
        notes: "Gittata 18m, due raggi.",
      },
    ],
    equipment: [
      { name: "Zaino del Sacerdote", quantity: 1 },
      { name: "Simbolo Sacro di Torm", quantity: 1 },
      { name: "Kit da Guaritore", quantity: 10 },
    ],
    coins: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
    personality: {
      appearance:
        "Aasimar alto e imponente, con capelli bianco-argento e occhi penetranti. Indossa un'armatura ornata bianca e oro.",
      backstory:
        "Ex-caporale degli Evenswords, ha stretto un patto con un'entità celestiale dopo aver perso la memoria e le sue certezze, guidato da visioni di un drago argentato.",
    },
    features: [
      {
        name: "Attaccante Selvaggio",
        description:
          "Una volta per turno, quando colpisci con un'arma, puoi ritirare i dadi di danno e usare il risultato migliore.",
      },
      {
        name: "Duellare",
        description:
          "Quando impugni un'arma da mischia in una mano e nessun'altra arma, ottieni un bonus di +2 ai tiri per i danni con quell'arma.",
      },
      {
        name: "Percezione Divina",
        description:
          "Come azione bonus, percepisci Celestiali, Immondi e Non-morti entro 18m.",
      },
      {
        name: "Imposizione delle Mani",
        description:
          "Hai una riserva di 25 Punti Vita (5 x liv. Paladino) per curare.",
      },
      {
        name: "Resistenza Celestiale",
        description: "Resistenza ai danni necrotici e radianti.",
      },
    ],
    spells: {
      ability: "Carisma",
      spellModifier: 2,
      saveDC: 13,
      attackBonus: 5,
      slots: { 1: { total: 5, used: 0 }, 2: { total: 2, used: 0 } },
      customTrackers: [
        { name: "Incanalare Divinità", max: 1, used: 0 },
        { name: "Patto Magico (Warlock)", max: 1, used: 0 },
      ],
      list: [
        {
          name: "Eldritch Blast",
          level: 0,
          school: "Invocazione",
          castingTime: "1 Azione",
          range: "36m",
          duration: "Istantanea",
          components: "V, S",
          isRitual: false,
          isConcentration: false,
          description:
            "Un raggio di energia crepitante si protende verso una creatura. Colpisce con un attacco di incantesimo a distanza. Infligge 1d10 danni da forza.",
          prepared: true,
        },
        {
          name: "Cure Wounds",
          level: 1,
          school: "Evocazione",
          castingTime: "1 Azione",
          range: "Tocco",
          duration: "Istantanea",
          components: "V, S",
          isRitual: false,
          isConcentration: false,
          description:
            "Una creatura che tocchi recupera un numero di punti ferita pari a 1d8 + il tuo modificatore di abilità da incantatore.",
          prepared: true,
        },
        {
          name: "Shield of Faith",
          level: 1,
          school: "Abiurazione",
          castingTime: "1 Azione Bonus",
          range: "18m",
          duration: "10 minuti",
          components: "V, S, M",
          isRitual: false,
          isConcentration: true,
          description:
            "Una creatura a gittata ottiene un bonus di +2 alla CA per la durata.",
          prepared: true,
        },
        {
          name: "Misty Step",
          level: 2,
          school: "Evocazione",
          castingTime: "1 Azione Bonus",
          range: "Sé",
          duration: "Istantanea",
          components: "V",
          isRitual: false,
          isConcentration: false,
          description:
            "Ti teletrasporti in uno spazio non occupato che puoi vedere entro 9 metri.",
          prepared: true,
        },
        {
          name: "Find Steed",
          level: 2,
          school: "Evocazione",
          castingTime: "10 minuti",
          range: "9m",
          duration: "Istantanea",
          components: "V, S",
          isRitual: true,
          isConcentration: false,
          description:
            "Evochi uno spirito che assume la forma di una cavalcatura leale.",
          prepared: false,
        },
      ],
    },
    imageUrl: "valenor.jpg",
  };
  const SKILL_MAP = {
    str: ["athletics"],
    dex: ["acrobatics", "sleightOfHand", "stealth"],
    int: ["arcana", "history", "investigation", "nature", "religion"],
    wis: ["animalHandling", "insight", "medicine", "perception", "survival"],
    cha: ["deception", "intimidation", "performance", "persuasion"],
  };
  let isEditMode = false;
  let spellFilter = "all";

  function renderSheet() {
    renderHeader();
    renderKeyStats();
    renderAbilities();
    renderCombatStats();
    renderAttacks();
    renderEquipment();
    renderPersonality();
    renderFeatures();
    renderProficiencies();
    renderSpells();
  }

  function renderHeader() {
    const d = characterData;
    document.getElementById(
      "portrait-container"
    ).innerHTML = `<div class="view-item"><img id="portrait-img" src="${d.imageUrl}" alt="Ritratto" onerror="this.style.display='none'"></div><div class="edit-item"><img src="${d.imageUrl}" alt="Ritratto" onerror="this.style.display='none'"><label>URL o nome file</label><input type="text" data-path="imageUrl" value="${d.imageUrl}"></div>`;
    document.getElementById(
      "character-name-display"
    ).innerHTML = `<span class="view-item">${d.name}</span><input type="text" class="edit-item" data-path="name" value="${d.name}">`;
    document.getElementById(
      "details-grid"
    ).innerHTML = `<div class="detail-box"><label>Classe & Multiclasse</label><div class="view-item">${d.class}</div><input type="text" class="edit-item" data-path="class" value="${d.class}"></div><div class="detail-box"><label>Specie</label><div class="view-item">${d.race}</div><input type="text" class="edit-item" data-path="race" value="${d.race}"></div><div class="detail-box"><label>Background</label><div class="view-item">${d.background}</div><input type="text" class="edit-item" data-path="background" value="${d.background}"></div><div class="detail-box"><label>Allineamento</label><div class="view-item">${d.alignment}</div><input type="text" class="edit-item" data-path="alignment" value="${d.alignment}"></div>`;
  }
  function renderKeyStats() {
    document.getElementById(
      "key-stats-container"
    ).innerHTML = `<div class="key-stat-box"><span class="stat-label">Livello Personaggio</span><span class="stat-value view-item">${characterData.level}</span><input class="stat-value edit-item" type="number" data-path="level" value="${characterData.level}"></div><div class="key-stat-box"><span class="stat-label">Bonus Competenza</span><span class="stat-value view-item">+${characterData.proficiencyBonus}</span><input class="stat-value edit-item" type="number" data-path="proficiencyBonus" value="${characterData.proficiencyBonus}"></div>`;
  }
  function renderAbilities() {
    const container = document.getElementById("abilities-container");
    container.innerHTML = "";
    Object.keys(characterData.abilities).forEach((key) => {
      const score = characterData.abilities[key];
      const modifier = Math.floor((score - 10) / 2);
      const isSavingThrowProficient = characterData.savingThrows[key];
      const savingThrowBonus =
        modifier +
        (isSavingThrowProficient ? characterData.proficiencyBonus : 0);
      let skillsHTML = '<ul class="skill-list">';
      skillsHTML += `<li style="font-weight: bold; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;"><span class="prof-dot view-item ${
        isSavingThrowProficient ? "proficient" : ""
      }"></span><input type="checkbox" class="skill-prof edit-item" data-type="save" data-skill="${key}" ${
        isSavingThrowProficient ? "checked" : ""
      }><span class="skill-name">Tiro Salvezza</span><strong>${
        savingThrowBonus >= 0 ? "+" : ""
      }${savingThrowBonus}</strong></li>`;
      if (SKILL_MAP[key]) {
        SKILL_MAP[key].forEach((skillKey) => {
          const isProficient =
            characterData.skills[skillKey]?.proficient || false;
          const skillBonus =
            modifier + (isProficient ? characterData.proficiencyBonus : 0);
          skillsHTML += `<li><span class="prof-dot view-item ${
            isProficient ? "proficient" : ""
          }"></span><input type="checkbox" class="skill-prof edit-item" data-type="skill" data-skill="${skillKey}" ${
            isProficient ? "checked" : ""
          }><span class="skill-name">${
            skillKey.charAt(0).toUpperCase() + skillKey.slice(1)
          }</span><strong>${
            skillBonus >= 0 ? "+" : ""
          }${skillBonus}</strong></li>`;
        });
      }
      skillsHTML += "</ul>";
      container.innerHTML += `<div class="ability-box"><div class="ability-header"><h3>${key.toUpperCase()}</h3><div class="ability-score view-item">${score}</div><input type="number" class="ability-score edit-item" data-path="abilities.${key}" value="${score}"><div class="ability-modifier">${
        modifier >= 0 ? "+" : ""
      }${modifier}</div></div>${skillsHTML}</div>`;
    });
  }
  function renderCombatStats() {
    const initiative = Math.floor((characterData.abilities.dex - 10) / 2);
    document.getElementById(
      "ac-box"
    ).innerHTML = `<span class="stat-value view-item">${characterData.ac}</span><input type="number" class="stat-value edit-item" data-path="ac" value="${characterData.ac}"><span class="stat-label">Classe Armatura</span>`;
    document.getElementById(
      "initiative-box"
    ).innerHTML = `<span class="stat-value">${
      initiative >= 0 ? "+" : ""
    }${initiative}</span><span class="stat-label">Iniziativa</span>`;
    document.getElementById(
      "speed-box"
    ).innerHTML = `<span class="stat-value view-item">${characterData.speed}</span><input type="text" class="stat-value edit-item" data-path="speed" value="${characterData.speed}"><span class="stat-label">Velocità</span>`;
    document.getElementById(
      "hp-box"
    ).innerHTML = `<h4>Punti Vita</h4><div id="hp-layout"><div class="hp-current-side"><div class="current-hp-value">${characterData.hp.current}</div><div class="stat-label">Punti Vita Attuali</div><div id="hp-controls"><input type="number" id="hp-change-value" value="1"><button id="heal-btn" class="btn">Cura</button><button id="damage-btn" class="btn">Danno</button></div></div><div class="hp-max-temp-side"><div class="hp-sub-box"><div class="stat-value view-item">${characterData.hp.max}</div><input type="number" class="stat-value edit-item" data-path="hp.max" value="${characterData.hp.max}"><div class="stat-label">HP Massimi</div></div><div class="hp-sub-box"><div class="stat-value">${characterData.hp.temp}</div><div class="stat-label">HP Temporanei</div><div><button class="btn btn-small" data-hp-type="temp" data-amount="-1">-1</button><button class="btn btn-small" data-hp-type="temp" data-amount="1">+1</button></div></div></div></div>`;
    const hd = characterData.hitDice;
    const hitDiceBox = document.getElementById("hit-dice-box");
    hitDiceBox.innerHTML = `<h4>Dadi Vita</h4>`;
    const viewContent = document.createElement("div");
    viewContent.className = "view-item";
    let viewHeartsHTML = "";
    hd.diceStates.forEach((isUsed, index) => {
      viewHeartsHTML += `<span class="hit-dice-icon ${
        isUsed ? "used" : ""
      }" data-type="hd" data-index="${index}">❤️</span>`;
    });
    viewContent.innerHTML = `<div style="text-align:center; color: var(--c-label); margin-bottom: 1rem;">Lancia 1${hd.type}</div><div class="tracker-grid">${viewHeartsHTML}</div>`;
    hitDiceBox.appendChild(viewContent);
    const editContent = document.createElement("div");
    editContent.className = "edit-item edit-item-controls";
    let dieTypes = ["d6", "d8", "d10", "d12"];
    let dieButtonsHTML = "";
    dieTypes.forEach((type) => {
      dieButtonsHTML += `<button class="btn btn-small ${
        hd.type === type ? "active" : ""
      }" data-hd-type-change="${type}">${type}</button>`;
    });
    editContent.innerHTML = `<div class="control-group"><label>Num. Dadi</label><div><button class="btn btn-small" data-hd-total-change="-1">-</button><span style="padding: 0 10px; font-weight: bold;">${hd.total}</span><button class="btn btn-small" data-hd-total-change="1">+</button></div></div><div class="control-group"><label>Tipo Dado</label><div class="die-type-buttons">${dieButtonsHTML}</div></div>`;
    hitDiceBox.appendChild(editContent);
    let dsHTML = `<h4>Tiri Salvezza vs Morte</h4>`;
    const deathSaves = [
      ["Successi", "success"],
      ["Fallimenti", "failure"],
    ];
    deathSaves.forEach(([label, type]) => {
      dsHTML += `<div class="death-save"><span>${label}</span><div class="tracker-grid">`;
      for (let i = 0; i < 3; i++) {
        const isToggled = i < characterData.deathSaves[type + "es"];
        dsHTML += `<span class="skull-icon ${
          isToggled ? "toggled " + type : ""
        }" data-type="ds" data-ds-type="${type}" data-index="${i}">💀</span>`;
      }
      dsHTML += `</div></div>`;
    });
    document.getElementById("death-saves-box").innerHTML = dsHTML;
  }
  function renderAttacks() {
    const c = document.getElementById("attacks-box");
    let h = `<h2>Attacchi</h2><div id="attacks-container">`;
    characterData.attacks.forEach((a, i) => {
      h += `<div class="attack-card"><div class="view-item"><h4>${a.name}</h4><div class="attack-stats"><span><strong>Bonus:</strong> ${a.bonus}</span><span><strong>Danno:</strong> ${a.damage}</span></div><div class="attack-notes">${a.notes}</div></div><div class="edit-item"><input type="text" data-path="attacks.${i}.name" value="${a.name}" placeholder="Nome Attacco"><div style="display:flex;gap:1rem;margin:0.5rem 0;"><input type="text" data-path="attacks.${i}.bonus" value="${a.bonus}" placeholder="Bonus"><input type="text" data-path="attacks.${i}.damage" value="${a.damage}" placeholder="Danno"></div><textarea data-path="attacks.${i}.notes">${a.notes}</textarea><button class="delete-btn" data-type="attacks" data-index="${i}">X</button></div></div>`;
    });
    h += `</div><button class="add-btn edit-item" data-type="attacks">+</button>`;
    c.innerHTML = h;
  }
  function renderEquipment() {
    let h = `<h2>Equipaggiamento</h2><ul class="item-list">`;
    characterData.equipment.forEach((item, index) => {
      h += `<li><div class="view-item">${item.name} (${item.quantity})</div><div class="edit-item" style="display:flex;gap:5px;width:100%;"><input type="text" data-path="equipment.${index}.name" value="${item.name}" placeholder="Oggetto"><input type="number" data-path="equipment.${index}.quantity" value="${item.quantity}" style="flex-basis:70px;"><button class="delete-btn" data-type="equipment" data-index="${index}">X</button></div></li>`;
    });
    h += `</ul><button class="add-btn edit-item" data-type="equipment">+</button>`;
    let c = `<div id="coin-container">`;
    Object.keys(characterData.coins).forEach((coin) => {
      c += `<div><span class="stat-label">${coin.toUpperCase()}</span><div class="stat-value view-item">${
        characterData.coins[coin]
      }</div><input type="number" class="stat-value edit-item" data-path="coins.${coin}" value="${
        characterData.coins[coin]
      }"></div>`;
    });
    document.getElementById("equipment-box").innerHTML = h + c + `</div>`;
  }
  function renderPersonality() {
    const p = characterData.personality;
    document.getElementById(
      "personality-box"
    ).innerHTML = `<h2>Personalità</h2><h4>Aspetto</h4><p class="view-item">${p.appearance.replace(
      /\n/g,
      "<br>"
    )}</p><textarea class="edit-item" data-path="personality.appearance">${
      p.appearance
    }</textarea><h4>Backstory</h4><p class="view-item">${p.backstory.replace(
      /\n/g,
      "<br>"
    )}</p><textarea class="edit-item" data-path="personality.backstory">${
      p.backstory
    }</textarea>`;
  }
  function renderFeatures() {
    let h = `<h2>Talenti e Privilegi</h2>`;
    characterData.features.forEach((f, i) => {
      h += `<div class="feature-item"><div class="view-item"><h4>${f.name}</h4><p>${f.description}</p></div><div class="edit-item"><input type="text" data-path="features.${i}.name" value="${f.name}" placeholder="Nome Privilegio"><textarea data-path="features.${i}.description">${f.description}</textarea><button class="delete-btn" data-type="features" data-index="${i}">X</button></div></div>`;
    });
    h += `<button class="add-btn edit-item" data-type="features">+</button>`;
    document.getElementById("features-box").innerHTML = h;
  }
  function renderProficiencies() {
    const c = characterData.proficiencies;
    document.getElementById(
      "proficiencies-box"
    ).innerHTML = `<h2>Altre Competenze</h2><h4>Armature</h4><p class="view-item">${c.armor}</p><textarea class="edit-item" data-path="proficiencies.armor">${c.armor}</textarea><h4>Armi</h4><p class="view-item">${c.weapons}</p><textarea class="edit-item" data-path="proficiencies.weapons">${c.weapons}</textarea><h4>Strumenti</h4><p class="view-item">${c.tools}</p><textarea class="edit-item" data-path="proficiencies.tools">${c.tools}</textarea><h4>Linguaggi</h4><p class="view-item">${c.languages}</p><textarea class="edit-item" data-path="proficiencies.languages">${c.languages}</textarea>`;
  }
  function renderSpells() {
    const s = characterData.spells;
    const spellModifierValue =
      s.spellModifier >= 0 ? `+${s.spellModifier}` : s.spellModifier;
    let h = `<h2>Incantesimi</h2><div class="spells-header"><div class="spell-main-stats"><div class="stat-box"><label>Abilità Incantesimi</label><div class="stat-value view-item">${s.ability}</div><input type="text" class="stat-value edit-item" data-path="spells.ability" value="${s.ability}"></div><div class="stat-box"><label>Modificatore Incantesimi</label><div class="stat-value view-item">${spellModifierValue}</div><input type="number" class="stat-value edit-item" data-path="spells.spellModifier" value="${s.spellModifier}"></div><div class="stat-box"><label>CD Salvezza Incantesimi</label><div class="stat-value view-item">${s.saveDC}</div><input type="number" class="stat-value edit-item" data-path="spells.saveDC" value="${s.saveDC}"></div><div class="stat-box"><label>Bonus Attacco Incantesimi</label><div class="stat-value view-item">${s.attackBonus}</div><input type="number" class="stat-value edit-item" data-path="spells.attackBonus" value="${s.attackBonus}"></div></div></div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><h4>Slot Incantesimo</h4><button id="long-rest-btn" class="btn btn-small">Riposo Lungo</button></div><div id="spell-slots-container"></div><button class="add-btn edit-item" data-type="spells.slots">+</button><h4 style="margin-top:1.5rem;">Contatori Speciali</h4><div id="custom-trackers-container"></div><button class="add-btn edit-item" data-type="spells.customTrackers">+</button><h4 style="margin-top:1.5rem;">Lista Incantesimi</h4><div id="spell-filters"></div><div id="spell-card-list"></div><button class="add-btn edit-item" data-type="spells.list">+</button>`;
    document.getElementById("spells-section-container").innerHTML = h;
    const slotsContainer = document.getElementById("spell-slots-container");
    slotsContainer.innerHTML = "";
    Object.entries(s.slots).forEach(([lvl, data]) => {
      let slotHTML = `<div class="spell-slot-row"><strong class="slot-label">Livello ${lvl}</strong><div class="edit-item" style="display:flex;align-items:center;gap:0.5rem;"><button class="btn btn-small" data-slot-change="${lvl}" data-amount="-1">-</button><span>${data.total}</span><button class="btn btn-small" data-slot-change="${lvl}" data-amount="1">+</button></div><div class="tracker-grid">`;
      for (let i = 0; i < data.total; i++)
        slotHTML += `<div class="tracker-dot ${
          i < data.used ? "used" : ""
        }" data-type="spell" data-level="${lvl}"></div>`;
      slotsContainer.innerHTML += slotHTML + `</div></div>`;
    });
    const customTrackersContainer = document.getElementById(
      "custom-trackers-container"
    );
    customTrackersContainer.innerHTML = "";
    s.customTrackers.forEach((tracker, index) => {
      let trackerHTML = `<div class="spell-slot-row"><div class="slot-label view-item">${tracker.name}</div><input class="slot-label edit-item" data-path="spells.customTrackers.${index}.name" value="${tracker.name}"><div class="edit-item" style="display:flex;align-items:center;gap:0.5rem;"><button class="btn btn-small" data-custom-tracker-change="${index}" data-amount="-1">-</button><span>${tracker.max}</span><button class="btn btn-small" data-custom-tracker-change="${index}" data-amount="1">+</button></div><div class="tracker-grid">`;
      for (let i = 0; i < tracker.max; i++)
        trackerHTML += `<div class="tracker-dot ${
          i < tracker.used ? "used" : ""
        }" data-type="custom" data-index="${index}"></div>`;
      customTrackersContainer.innerHTML +=
        trackerHTML +
        `</div><div class="edit-item" style="text-align:right;"><button class="delete-btn" data-type="spells.customTrackers" data-index="${index}">X</button></div></div>`;
    });
    const filtersContainer = document.getElementById("spell-filters");
    const levels = [...new Set(s.list.map((spell) => spell.level))].sort(
      (a, b) => a - b
    );
    let filtersHTML = `<button class="btn btn-small filter-btn ${
      spellFilter === "all" ? "active" : ""
    }" data-filter="all">Tutti</button> <button class="btn btn-small filter-btn ${
      spellFilter === "prepared" ? "active" : ""
    }" data-filter="prepared">Preparati</button>`;
    levels.forEach((level) => {
      filtersHTML += `<button class="btn btn-small filter-btn ${
        spellFilter == level ? "active" : ""
      }" data-filter="${level}">${
        level === 0 ? "Trucchetti" : `Lvl ${level}`
      }</button>`;
    });
    filtersContainer.innerHTML = filtersHTML;
    const cardListContainer = document.getElementById("spell-card-list");
    cardListContainer.innerHTML = "";
    s.list
      .filter((spell) => {
        if (spellFilter === "all") return true;
        if (spellFilter === "prepared") return spell.prepared;
        return spell.level == spellFilter;
      })
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
      .forEach((spell) => {
        const originalIndex = s.list.findIndex(
          (s) => s.name === spell.name && s.level === spell.level
        );
        let cardHTML = `<div class="spell-card"><div class="spell-card-header" data-card-index="${originalIndex}"><div class="spell-level">${
          spell.level === 0 ? "C" : spell.level
        }</div><div class="spell-name view-item">${
          spell.name
        }</div><input type="text" class="spell-name edit-item" data-path="spells.list.${originalIndex}.name" value="${
          spell.name
        }"><div class="spell-tags">${
          spell.isConcentration ? '<span class="spell-tag">C</span>' : ""
        }${
          spell.isRitual ? '<span class="spell-tag">R</span>' : ""
        }</div><input type="checkbox" data-prepare-index="${originalIndex}" ${
          spell.prepared ? "checked" : ""
        } title="Preparato"></div><div class="spell-card-body"><h5>${
          spell.school
        }</h5><div class="spell-details-grid"><div class="spell-detail"><label>Tempo di Lancio</label><p class="view-item">${
          spell.castingTime
        }</p><input class="edit-item" data-path="spells.list.${originalIndex}.castingTime" value="${
          spell.castingTime
        }"></div><div class="spell-detail"><label>Gittata</label><p class="view-item">${
          spell.range
        }</p><input class="edit-item" data-path="spells.list.${originalIndex}.range" value="${
          spell.range
        }"></div><div class="spell-detail"><label>Durata</label><p class="view-item">${
          spell.duration
        }</p><input class="edit-item" data-path="spells.list.${originalIndex}.duration" value="${
          spell.duration
        }"></div><div class="spell-detail"><label>Componenti</label><p class="view-item">${
          spell.components
        }</p><input class="edit-item" data-path="spells.list.${originalIndex}.components" value="${
          spell.components
        }"></div></div><label>Descrizione</label><p class="view-item">${spell.description.replace(
          /\n/g,
          "<br>"
        )}</p><textarea class="edit-item" data-path="spells.list.${originalIndex}.description">${
          spell.description
        }</textarea><button class="delete-btn edit-item" data-type="spells.list" data-index="${originalIndex}">X</button></div></div>`;
        cardListContainer.innerHTML += cardHTML;
      });
  }
  function handleInteraction(e) {
    const target = e.target;
    if (target.matches(".add-btn")) {
      const type = target.dataset.type;
      if (type === "spells.list") {
        const name = prompt("Nome del nuovo incantesimo:", "Nuovo Incantesimo");
        if (!name) return;
        const level = parseInt(prompt("Livello (0-9):", "1"), 10);
        const description = prompt("Breve descrizione:", "...");
        characterData.spells.list.push({
          level: isNaN(level) ? 1 : level,
          name: name,
          description: description,
          prepared: true,
          school: "N/A",
          castingTime: "1 Azione",
          range: "N/A",
          duration: "Istantanea",
          components: "V, S, M",
          isConcentration: false,
          isRitual: false,
        });
      } else if (type === "spells.customTrackers") {
        const name = prompt("Nome del contatore:", "Risorsa di Classe");
        if (!name) return;
        const max = parseInt(prompt("Numero massimo di utilizzi:", "1"), 10);
        characterData.spells.customTrackers.push({
          name: name,
          max: isNaN(max) ? 1 : max,
          used: 0,
        });
      } else if (type === "spells.slots") {
        const level = parseInt(
          prompt("Nuovo livello di incantesimo (es. 3):", "3"),
          10
        );
        if (level > 0 && level <= 9 && !characterData.spells.slots[level]) {
          const total = parseInt(
            prompt(`Quanti slot totali per il livello ${level}?`, "2"),
            10
          );
          characterData.spells.slots[level] = {
            total: isNaN(total) ? 2 : total,
            used: 0,
          };
        } else {
          alert("Livello non valido o già esistente.");
        }
      } else if (type === "attacks") {
        characterData.attacks.push({
          name: "Nuovo Attacco",
          bonus: "+0",
          damage: "1d4",
          notes: "",
        });
      } else if (type === "equipment") {
        characterData.equipment.push({ name: "Nuovo Oggetto", quantity: 1 });
      } else if (type === "features") {
        characterData.features.push({
          name: "Nuovo Privilegio",
          description: "Descrizione...",
        });
      }
      renderSheet();
    }
    if (target.matches(".delete-btn")) {
      const type = target.dataset.type;
      const index = parseInt(target.dataset.index, 10);
      const list = type.split(".").reduce((o, i) => o[i], characterData);
      list.splice(index, 1);
      renderSheet();
    }
    if (isEditMode && target.matches("[data-slot-change]")) {
      const level = target.dataset.slotChange;
      const amount = parseInt(target.dataset.amount, 10);
      characterData.spells.slots[level].total = Math.max(
        0,
        characterData.spells.slots[level].total + amount
      );
      renderSpells();
    }
    if (isEditMode && target.matches("[data-custom-tracker-change]")) {
      const index = parseInt(target.dataset.customTrackerChange, 10);
      const amount = parseInt(target.dataset.amount, 10);
      characterData.spells.customTrackers[index].max = Math.max(
        0,
        characterData.spells.customTrackers[index].max + amount
      );
      renderSpells();
    }
    if (target.matches('.tracker-dot[data-type="custom"]')) {
      const index = parseInt(target.dataset.index, 10);
      const tracker = characterData.spells.customTrackers[index];
      if (tracker.used < tracker.max) {
        tracker.used++;
      } else {
        tracker.used = 0;
      }
      renderSpells();
    }
    if (target.matches("#long-rest-btn")) {
      if (confirm("Recuperare tutti gli slot incantesimo e i contatori?")) {
        for (const level in characterData.spells.slots) {
          characterData.spells.slots[level].used = 0;
        }
        for (const tracker of characterData.spells.customTrackers) {
          tracker.used = 0;
        }
        renderSpells();
      }
    }
    if (target.matches(".hit-dice-icon")) {
      const index = parseInt(target.dataset.index, 10);
      characterData.hitDice.diceStates[index] =
        !characterData.hitDice.diceStates[index];
      renderCombatStats();
    }
    if (isEditMode && target.matches("[data-hd-total-change]")) {
      const change = parseInt(target.dataset.hdTotalChange, 10);
      const newTotal = Math.max(0, characterData.hitDice.total + change);
      characterData.hitDice.total = newTotal;
      while (characterData.hitDice.diceStates.length < newTotal) {
        characterData.hitDice.diceStates.push(false);
      }
      characterData.hitDice.diceStates.length = newTotal;
      renderCombatStats();
    }
    if (isEditMode && target.matches("[data-hd-type-change]")) {
      characterData.hitDice.type = target.dataset.hdTypeChange;
      renderCombatStats();
    }
    if (target.matches('.tracker-dot[data-type="spell"]')) {
      const level = target.dataset.level;
      const slots = characterData.spells.slots[level];
      if (slots.used < slots.total) {
        slots.used++;
      } else {
        slots.used = 0;
      }
      renderSpells();
    }
    if (
      target.closest(".spell-card-header") &&
      !e.target.matches("input") &&
      !e.target.matches(".delete-btn")
    ) {
      target.closest(".spell-card").classList.toggle("expanded");
    }
    if (target.matches(".filter-btn")) {
      spellFilter = target.dataset.filter;
      renderSpells();
    }
    if (target.matches('[data-hp-type="temp"]')) {
      const amount = parseInt(target.dataset.amount, 10);
      characterData.hp.temp = Math.max(0, characterData.hp.temp + amount);
      renderCombatStats();
    }
    if (target.matches(".skull-icon")) {
      const type = target.dataset.dsType;
      const index = parseInt(target.dataset.index, 10);
      const key = type + "es";
      characterData.deathSaves[key] =
        characterData.deathSaves[key] === index + 1 ? index : index + 1;
      renderCombatStats();
    }
    if (target.id === "heal-btn" || target.id === "damage-btn") {
      const val = parseInt(
        document.getElementById("hp-change-value").value,
        10
      );
      const isHealing = target.id === "heal-btn";
      characterData.hp.current = isHealing
        ? Math.min(characterData.hp.max, characterData.hp.current + val)
        : Math.max(0, characterData.hp.current - val);
      renderCombatStats();
    }
  }
  function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle("edit-mode", isEditMode);
    document.body.classList.toggle("view-mode", !isEditMode);
    const btn = document.getElementById("edit-mode-btn");
    btn.textContent = isEditMode ? "Salva e Blocca" : "Modifica Scheda";
    btn.classList.toggle("save-btn", isEditMode);
    renderSheet();
  }
  function saveData() {
    document.querySelectorAll("[data-path]").forEach((el) => {
      const path = el.dataset.path.split(".");
      let obj = characterData;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      if (
        path[0] === "hitDice" ||
        (path[0] === "spells" &&
          path[1] === "customTrackers" &&
          path.length > 2) ||
        (path[0] === "spells" && path[1] === "slots")
      )
        return;
      const value =
        el.type === "number" ? parseInt(el.value, 10) || 0 : el.value;
      obj[path[path.length - 1]] = value;
    });
    document.querySelectorAll(".skill-prof.edit-item").forEach((el) => {
      const key = el.dataset.skill;
      const type = el.dataset.type;
      if (type === "save") {
        characterData.savingThrows[key] = el.checked;
      } else {
        characterData.skills[key].proficient = el.checked;
      }
    });
    characterData.spells.list.forEach((spell, index) => {
      const prepCheckbox = document.querySelector(
        `[data-prepare-index="${index}"]`
      );
      if (prepCheckbox) {
        spell.prepared = prepCheckbox.checked;
      }
    });
    localStorage.setItem("dndCharacterSheet", JSON.stringify(characterData));
    const feedback = document.getElementById("save-feedback");
    feedback.textContent = "Salvato!";
    feedback.classList.add("visible");
    setTimeout(() => feedback.classList.remove("visible"), 2000);
  }
  function loadData() {
    const savedData = localStorage.getItem("dndCharacterSheet");
    if (savedData) {
      let loadedData = JSON.parse(savedData);
      if (
        loadedData.hitDice &&
        loadedData.hitDice.used !== undefined &&
        !loadedData.hitDice.diceStates
      ) {
        const totalDice =
          parseInt(loadedData.hitDice.total, 10) || characterData.hitDice.total;
        loadedData.hitDice.diceStates = Array(totalDice)
          .fill(false)
          .map((_, i) => i < loadedData.hitDice.used);
        delete loadedData.hitDice.used;
      }
      const merge = (target, source) => {
        for (const key of Object.keys(source)) {
          if (
            source[key] instanceof Object &&
            !Array.isArray(source[key]) &&
            key in target &&
            target[key] instanceof Object
          ) {
            merge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
        return target;
      };
      characterData = merge(characterData, loadedData);
    }
  }
  loadData();
  renderSheet();
  document.body.classList.add("view-mode");
  document.getElementById("edit-mode-btn").addEventListener("click", () => {
    if (isEditMode) {
      saveData();
    }
    toggleEditMode();
  });
  document.body.addEventListener("click", handleInteraction);
  document.body.addEventListener("change", (e) => {
    if (isEditMode && e.target.matches(".skill-prof")) {
      const key = e.target.dataset.skill;
      const type = e.target.dataset.type;
      if (type === "save") {
        characterData.savingThrows[key] = e.target.checked;
      } else {
        characterData.skills[key].proficient = e.target.checked;
      }
      renderAbilities();
    }
    if (e.target.matches("[data-prepare-index]")) {
      const index = parseInt(e.target.dataset.prepareIndex, 10);
      characterData.spells.list[index].prepared = e.target.checked;
    }
  });
  document.body.addEventListener("input", (e) => {
    if (isEditMode && e.target.matches('[data-path^="abilities."]')) {
      const key = e.target.dataset.path.split(".")[1];
      characterData.abilities[key] = parseInt(e.target.value, 10) || 0;
      renderAbilities();
    }
  });
});
