document.addEventListener('DOMContentLoaded', () => {

    let characterData = {
        name: "Valenor Lightbringer", class: "Paladino 5 / Warlock 1", level: 6, background: "Soldato", race: "Aasimar", alignment: "Neutrale Buono", ac: 18, speed: "30ft",
        hp: { max: 60, current: 60, temp: 0 },
        hitDice: { total: "5d10", used: 0, size: 5 },
        deathSaves: { successes: 0, failures: 0 },
        proficiencyBonus: 3,
        abilities: { str: 17, dex: 10, con: 14, int: 8, wis: 12, cha: 15 },
        savingThrows: { str: true, dex: false, con: true, int: false, wis: true, cha: true },
        skills: { athletics: { proficient: true }, acrobatics: { proficient: false }, sleightOfHand: { proficient: false }, stealth: { proficient: false }, arcana: { proficient: false }, history: { proficient: false }, investigation: { proficient: false }, nature: { proficient: false }, religion: { proficient: false }, animalHandling: { proficient: false }, insight: { proficient: true }, medicine: { proficient: false }, perception: { proficient: false }, survival: { proficient: false }, deception: { proficient: false }, intimidation: { proficient: true }, performance: { proficient: false }, persuasion: { proficient: true }},
        proficiencies: { armor: "Armature Leggere, Medie, Pesanti, Scudi", weapons: "Armi Semplici, Armi da Guerra", tools: "Set da Gioco (dadi)", languages: "Comune, Celestiale, Orchesco" },
        attacks: [ { name: "Egen-Vath", bonus: "+7", damage: "2d6s + 1d4f + 4", notes: "Se l'attacco manca, l'avversario subisce comunque 3 danni da fuoco." }, { name: "Spada Lunga (+1)", bonus: "+7", damage: "1d8+6 Tagliente", notes: "Stile Duellare (+2 danni) attivo." }, { name: "Eldritch Blast", bonus: "+5", damage: "2d10 Forza", notes: "Gittata 18m, due raggi." } ],
        equipment: [ { name: "Zaino del Sacerdote", quantity: 1 }, { name: "Simbolo Sacro di Torm", quantity: 1 }, { name: "Kit da Guaritore", quantity: 10 } ],
        coins: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        personality: { appearance: "Aasimar alto e imponente, con capelli bianco-argento e occhi penetranti. Indossa un'armatura ornata bianca e oro.", backstory: "Ex-caporale degli Evenswords, ha stretto un patto con un'entità celestiale dopo aver perso la memoria e le sue certezze, guidato da visioni di un drago argentato." },
        features: [ { name: "Attaccante Selvaggio", description: "Una volta per turno, quando colpisci con un'arma, puoi ritirare i dadi di danno e usare il risultato migliore." }, { name: "Duellare", description: "Quando impugni un'arma da mischia in una mano e nessun'altra arma, ottieni un bonus di +2 ai tiri per i danni con quell'arma." }, { name: "Percezione Divina", description: "Come azione bonus, percepisci Celestiali, Immondi e Non-morti entro 18m." }, { name: "Imposizione delle Mani", description: "Hai una riserva di 25 Punti Vita (5 x liv. Paladino) per curare." }, { name: "Resistenza Celestiale", description: "Resistenza ai danni necrotici e radianti."} ],
        spells: { ability: "Carisma", saveDC: 13, attackBonus: 5, slots: { 1: { total: 5, used: 0 }, 2: { total: 2, used: 0 } }, list: [ { level: 0, name: "Eldritch Blast" }, { level: 1, name: "Cure Wounds" }, { level: 1, name: "Divine Favor" }, { level: 1, name: "Shield of Faith" }, { level: 2, name: "Misty Step" }, { level: 2, name: "Find Steed" } ] },
        imageUrl: "valenor.jpg"
    };

    const SKILL_MAP = { str: ['athletics'], dex: ['acrobatics', 'sleightOfHand', 'stealth'], int: ['arcana', 'history', 'investigation', 'nature', 'religion'], wis: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'], cha: ['deception', 'intimidation', 'performance', 'persuasion'] };
    let isEditMode = false;

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
        document.getElementById('portrait-container').innerHTML = `<div class="view-item"><img id="portrait-img" src="${d.imageUrl}" alt="Ritratto" onerror="this.style.display='none'"></div><div class="edit-item"><img src="${d.imageUrl}" alt="Ritratto" onerror="this.style.display='none'"><label>URL o nome file</label><input type="text" data-path="imageUrl" value="${d.imageUrl}"></div>`;
        document.getElementById('character-name-display').innerHTML = `<span class="view-item">${d.name}</span><input type="text" class="edit-item" data-path="name" value="${d.name}">`;
        document.getElementById('details-grid').innerHTML = `<div class="detail-box"><label>Classe & Multiclasse</label><div class="view-item">${d.class}</div><input type="text" class="edit-item" data-path="class" value="${d.class}"></div><div class="detail-box"><label>Specie</label><div class="view-item">${d.race}</div><input type="text" class="edit-item" data-path="race" value="${d.race}"></div><div class="detail-box"><label>Background</label><div class="view-item">${d.background}</div><input type="text" class="edit-item" data-path="background" value="${d.background}"></div><div class="detail-box"><label>Allineamento</label><div class="view-item">${d.alignment}</div><input type="text" class="edit-item" data-path="alignment" value="${d.alignment}"></div>`;
    }

    function renderKeyStats() {
        document.getElementById('key-stats-container').innerHTML = `
            <div class="key-stat-box"><span class="stat-label">Livello Personaggio</span><span class="stat-value view-item">${characterData.level}</span><input class="stat-value edit-item" type="number" data-path="level" value="${characterData.level}"></div>
            <div class="key-stat-box"><span class="stat-label">Bonus Competenza</span><span class="stat-value view-item">+${characterData.proficiencyBonus}</span><input class="stat-value edit-item" type="number" data-path="proficiencyBonus" value="${characterData.proficiencyBonus}"></div>`;
    }

    function renderAbilities() {
        const container = document.getElementById('abilities-container'); container.innerHTML = '';
        Object.keys(characterData.abilities).forEach(key => {
            const score = characterData.abilities[key];
            const modifier = Math.floor((score - 10) / 2);
            const isSavingThrowProficient = characterData.savingThrows[key];
            const savingThrowBonus = modifier + (isSavingThrowProficient ? characterData.proficiencyBonus : 0);
            let skillsHTML = '<ul class="skill-list">';
            skillsHTML += `<li style="font-weight: bold; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                <span class="prof-dot view-item ${isSavingThrowProficient ? 'proficient' : ''}"></span>
                <input type="checkbox" class="skill-prof edit-item" data-type="save" data-skill="${key}" ${isSavingThrowProficient ? 'checked' : ''}>
                <span class="skill-name">Tiro Salvezza</span><strong>${savingThrowBonus >= 0 ? '+' : ''}${savingThrowBonus}</strong></li>`;
            if (SKILL_MAP[key]) {
                SKILL_MAP[key].forEach(skillKey => {
                    const isProficient = characterData.skills[skillKey]?.proficient || false;
                    const skillBonus = modifier + (isProficient ? characterData.proficiencyBonus : 0);
                    skillsHTML += `<li><span class="prof-dot view-item ${isProficient ? 'proficient' : ''}"></span>
                        <input type="checkbox" class="skill-prof edit-item" data-type="skill" data-skill="${skillKey}" ${isProficient ? 'checked' : ''}>
                        <span class="skill-name">${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)}</span>
                        <strong>${skillBonus >= 0 ? '+' : ''}${skillBonus}</strong></li>`;
                });
            }
            skillsHTML += '</ul>';
            container.innerHTML += `<div class="ability-box"><div class="ability-header"><h3>${key.toUpperCase()}</h3>
                <div class="ability-score view-item">${score}</div><input type="number" class="ability-score edit-item" data-path="abilities.${key}" value="${score}">
                <div class="ability-modifier">${modifier >= 0 ? '+' : ''}${modifier}</div></div>${skillsHTML}</div>`;
        });
    }

    function renderCombatStats() {
        const initiative = Math.floor((characterData.abilities.dex - 10) / 2);
        document.getElementById('ac-box').innerHTML = `<span class="stat-value view-item">${characterData.ac}</span><input type="number" class="stat-value edit-item" data-path="ac" value="${characterData.ac}"><span class="stat-label">Classe Armatura</span>`;
        document.getElementById('initiative-box').innerHTML = `<span class="stat-value">${initiative >= 0 ? '+' : ''}${initiative}</span><span class="stat-label">Iniziativa</span>`;
        document.getElementById('speed-box').innerHTML = `<span class="stat-value view-item">${characterData.speed}</span><input type="text" class="stat-value edit-item" data-path="speed" value="${characterData.speed}"><span class="stat-label">Velocità</span>`;
        document.getElementById('hp-box').innerHTML = `<h4>Punti Vita</h4><div class="hp-grid"><div><span class="stat-value view-item">${characterData.hp.max}</span><input type="number" class="stat-value edit-item" data-path="hp.max" value="${characterData.hp.max}"><span class="stat-label">Massimi</span></div><div><span class="current-hp">${characterData.hp.current}</span><span class="stat-label">Attuali</span></div><div><span class="stat-value view-item">${characterData.hp.temp}</span><input type="number" class="stat-value edit-item" data-path="hp.temp" value="${characterData.hp.temp}"><span class="stat-label">Temporanei</span></div></div><div id="hp-controls"><input type="number" id="hp-change-value" value="1"><button id="heal-btn" class="btn">Cura</button><button id="damage-btn" class="btn">Danno</button></div>`;
        let hdHTML = `<h4>Dadi Vita (${characterData.hitDice.total})</h4><div class="tracker-grid">`;
        for (let i = 0; i < characterData.hitDice.size; i++) hdHTML += `<div class="tracker-dot ${i < characterData.hitDice.used ? 'used' : ''}" data-type="hd" data-index="${i}"></div>`;
        document.getElementById('hit-dice-box').innerHTML = hdHTML + `</div>`;
        let dsHTML = `<h4>Tiri Salvezza vs Morte</h4><div class="death-save"><span>Successi</span><div class="tracker-grid">`;
        for (let i = 0; i < 3; i++) dsHTML += `<input type="checkbox" data-type="ds-success" data-index="${i}" ${i < characterData.deathSaves.successes ? 'checked' : ''}>`;
        dsHTML += `</div></div><div class="death-save"><span>Fallimenti</span><div class="tracker-grid">`;
        for (let i = 0; i < 3; i++) dsHTML += `<input type="checkbox" data-type="ds-failure" data-index="${i}" ${i < characterData.deathSaves.failures ? 'checked' : ''}>`;
        document.getElementById('death-saves-box').innerHTML = dsHTML + `</div></div>`;
    }

    function renderAttacks() {
        const container = document.getElementById('attacks-box');
        let attacksHTML = `<h2>Attacchi</h2><div id="attacks-container">`;
        characterData.attacks.forEach((attack, index) => { attacksHTML += `<div class="attack-card"><div class="view-item"><h4>${attack.name}</h4><div class="attack-stats"><span><strong>Bonus:</strong> ${attack.bonus}</span><span><strong>Danno:</strong> ${attack.damage}</span></div><div class="attack-notes">${attack.notes}</div></div><div class="edit-item"><input type="text" data-path="attacks.${index}.name" value="${attack.name}" placeholder="Nome Attacco"><div style="display: flex; gap: 1rem; margin: 0.5rem 0;"><input type="text" data-path="attacks.${index}.bonus" value="${attack.bonus}" placeholder="Bonus"><input type="text" data-path="attacks.${index}.damage" value="${attack.damage}" placeholder="Danno"></div><textarea data-path="attacks.${index}.notes">${attack.notes}</textarea><button class="delete-btn" data-type="attacks" data-index="${index}">X</button></div></div>`; });
        attacksHTML += `</div><button class="add-btn edit-item" data-type="attacks">+</button>`;
        container.innerHTML = attacksHTML;
    }

    function renderEquipment() {
        let equipmentHTML = `<h2>Equipaggiamento</h2><ul class="item-list">`;
        characterData.equipment.forEach((item, index) => { equipmentHTML += `<li><div class="view-item">${item.name} (${item.quantity})</div><div class="edit-item" style="display:flex; gap: 5px; width: 100%;"><input type="text" data-path="equipment.${index}.name" value="${item.name}" placeholder="Oggetto"><input type="number" data-path="equipment.${index}.quantity" value="${item.quantity}" style="flex-basis: 70px;"><button class="delete-btn" data-type="equipment" data-index="${index}">X</button></div></li>`; });
        equipmentHTML += `</ul><button class="add-btn edit-item" data-type="equipment">+</button>`;
        let coinsHTML = `<div id="coin-container">`;
        Object.keys(characterData.coins).forEach(coin => { coinsHTML += `<div><span class="stat-label">${coin.toUpperCase()}</span><div class="stat-value view-item">${characterData.coins[coin]}</div><input type="number" class="stat-value edit-item" data-path="coins.${coin}" value="${characterData.coins[coin]}"></div>`; });
        document.getElementById('equipment-box').innerHTML = equipmentHTML + coinsHTML + `</div>`;
    }
    
    function renderPersonality() {
        const p = characterData.personality;
        document.getElementById('personality-box').innerHTML = `<h2>Personalità</h2>
            <h4>Aspetto</h4><p class="view-item">${p.appearance.replace(/\n/g, '<br>')}</p><textarea class="edit-item" data-path="personality.appearance">${p.appearance}</textarea>
            <h4>Backstory</h4><p class="view-item">${p.backstory.replace(/\n/g, '<br>')}</p><textarea class="edit-item" data-path="personality.backstory">${p.backstory}</textarea>`;
    }

    function renderFeatures() {
        let featuresHTML = `<h2>Talenti e Privilegi</h2>`;
        characterData.features.forEach((feat, index) => { featuresHTML += `<div class="feature-item"><div class="view-item"><h4>${feat.name}</h4><p>${feat.description}</p></div><div class="edit-item"><input type="text" data-path="features.${index}.name" value="${feat.name}" placeholder="Nome Privilegio"><textarea data-path="features.${index}.description">${feat.description}</textarea><button class="delete-btn" data-type="features" data-index="${index}">X</button></div></div>`; });
        featuresHTML += `<button class="add-btn edit-item" data-type="features">+</button>`;
        document.getElementById('features-box').innerHTML = featuresHTML;
    }

    function renderProficiencies() {
        const c = characterData.proficiencies;
        document.getElementById('proficiencies-box').innerHTML = `<h2>Altre Competenze</h2>
            <h4>Armature</h4><p class="view-item">${c.armor}</p><textarea class="edit-item" data-path="proficiencies.armor">${c.armor}</textarea>
            <h4>Armi</h4><p class="view-item">${c.weapons}</p><textarea class="edit-item" data-path="proficiencies.weapons">${c.weapons}</textarea>
            <h4>Strumenti</h4><p class="view-item">${c.tools}</p><textarea class="edit-item" data-path="proficiencies.tools">${c.tools}</textarea>
            <h4>Linguaggi</h4><p class="view-item">${c.languages}</p><textarea class="edit-item" data-path="proficiencies.languages">${c.languages}</textarea>`;
    }

    function renderSpells() {
        const s = characterData.spells;
        let spellsHTML = `<h2>Incantesimi</h2>
            <div class="main-stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1rem;">
                <div class="stat-box"><span class="stat-value view-item">${s.ability}</span><input type="text" class="stat-value edit-item" data-path="spells.ability" value="${s.ability}"><span class="stat-label">Abilità</span></div>
                <div class="stat-box"><span class="stat-value view-item">${s.saveDC}</span><input type="number" class="stat-value edit-item" data-path="spells.saveDC" value="${s.saveDC}"><span class="stat-label">CD</span></div>
                <div class="stat-box"><span class="stat-value view-item">${s.attackBonus}</span><input type="number" class="stat-value edit-item" data-path="spells.attackBonus" value="${s.attackBonus}"><span class="stat-label">Attacco</span></div>
            </div><h4>Slot</h4><div class="spell-slots-grid">`;
        Object.entries(s.slots).forEach(([level, data]) => {
            spellsHTML += `<div><h5>Lvl ${level}</h5><div class="tracker-grid">`;
            for(let i = 0; i < data.total; i++) spellsHTML += `<div class="tracker-dot ${i < data.used ? 'used' : ''}" data-type="spell" data-level="${level}" data-index="${i}"></div>`;
            spellsHTML += `</div></div>`;
        });
        spellsHTML += `</div><ul class="item-list">`;
        s.list.forEach((spell, index) => {
            spellsHTML += `<li><div class="view-item"><strong>${spell.name}</strong> (Lvl ${spell.level})</div>
                <div class="edit-item" style="display:flex; gap:5px; width: 100%;">
                    <input type="number" data-path="spells.list.${index}.level" value="${spell.level}" style="flex-basis: 60px;">
                    <input type="text" data-path="spells.list.${index}.name" value="${spell.name}">
                    <button class="delete-btn" data-type="spells.list" data-index="${index}">X</button>
                </div></li>`;
        });
        spellsHTML += `</ul><button class="add-btn edit-item" data-type="spells.list">+</button>`;
        document.getElementById('spells-box').innerHTML = spellsHTML;
    }
    
    function handleInteraction(e) {
        const target = e.target;
        if (target.matches('.add-btn')) { const type = target.dataset.type; if (type === 'attacks') characterData.attacks.push({ name: "Nuovo Attacco", bonus: "+0", damage: "1d4", notes: "" }); if (type === 'equipment') characterData.equipment.push({ name: "Nuovo Oggetto", quantity: 1 }); if (type === 'features') characterData.features.push({ name: "Nuovo Privilegio", description: "Descrizione..." }); if (type === 'spells.list') characterData.spells.list.push({ level: 1, name: "Nuovo Incantesimo" }); renderSheet(); }
        if (target.matches('.delete-btn')) { const type = target.dataset.type; const index = parseInt(target.dataset.index, 10); const list = type.split('.').reduce((o, i) => o[i], characterData); list.splice(index, 1); renderSheet(); }
        if (target.matches('.tracker-dot')) { const type = target.dataset.type; const index = parseInt(target.dataset.index, 10); if (type === 'hd') { characterData.hitDice.used = (characterData.hitDice.used === index + 1) ? index : index + 1; renderCombatStats(); } if (type === 'spell') { const level = target.dataset.level; characterData.spells.slots[level].used = (characterData.spells.slots[level].used === index + 1) ? index : index + 1; renderSpells(); } }
        if(target.id === 'heal-btn' || target.id === 'damage-btn') { const val = parseInt(document.getElementById('hp-change-value').value, 10); const isHealing = target.id === 'heal-btn'; characterData.hp.current = isHealing ? Math.min(characterData.hp.max, characterData.hp.current + val) : Math.max(0, characterData.hp.current - val); renderCombatStats(); }
    }

    function saveData() {
        document.querySelectorAll('[data-path]').forEach(el => {
            const path = el.dataset.path.split('.'); let obj = characterData;
            for (let i = 0; i < path.length - 1; i++) { obj = obj[path[i]]; }
            const value = el.type === 'number' ? parseInt(el.value, 10) || 0 : el.value;
            obj[path[path.length - 1]] = value;
        });
        document.querySelectorAll('.skill-prof.edit-item').forEach(el => {
            const key = el.dataset.skill; const type = el.dataset.type;
            if (type === 'save') { characterData.savingThrows[key] = el.checked; } else { characterData.skills[key].proficient = el.checked; }
        });
        localStorage.setItem('dndCharacterSheet', JSON.stringify(characterData));
        const feedback = document.getElementById('save-feedback');
        feedback.textContent = 'Salvato!'; feedback.classList.add('visible');
        setTimeout(() => feedback.classList.remove('visible'), 2000);
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode', isEditMode);
        document.body.classList.toggle('view-mode', !isEditMode);
        const btn = document.getElementById('edit-mode-btn');
        btn.textContent = isEditMode ? 'Salva e Blocca' : 'Modifica Scheda';
        btn.classList.toggle('save-btn', isEditMode);
        renderSheet();
    }
    
    function loadData() {
        const savedData = localStorage.getItem('dndCharacterSheet');
        if (savedData) {
            const loadedData = JSON.parse(savedData);
            // Deep merge to prevent issues with new fields in the default data
            const merge = (target, source) => {
                for (const key of Object.keys(source)) {
                    if (source[key] instanceof Object && key in target) {
                        Object.assign(source[key], merge(target[key], source[key]))
                    }
                }
                Object.assign(target || {}, source)
                return target
            }
            characterData = merge(characterData, loadedData);
        }
    }

    loadData(); renderSheet(); document.body.classList.add('view-mode');
    document.getElementById('edit-mode-btn').addEventListener('click', () => { if (isEditMode) { saveData(); } toggleEditMode(); });
    document.body.addEventListener('click', handleInteraction);
    document.body.addEventListener('change', (e) => {
        if (e.target.matches('.skill-prof.edit-item')) {
            const key = e.target.dataset.skill; const type = e.target.dataset.type;
            if(type === 'save') { characterData.savingThrows[key] = e.target.checked; } else { characterData.skills[key].proficient = e.target.checked; }
            renderAbilities();
        }
        if (e.target.matches('[data-type^="ds-"]')) {
            const type = e.target.dataset.type === 'ds-success' ? 'successes' : 'failures';
            let count = 0; document.querySelectorAll(`[data-type="ds-${type === 'successes' ? 'success' : 'failure'}"]:checked`).forEach(() => count++);
            characterData.deathSaves[type] = count;
        }
    });
    document.body.addEventListener('input', (e) => {
        if(isEditMode && e.target.matches('[data-path^="abilities."]')) {
            const key = e.target.dataset.path.split('.')[1];
            characterData.abilities[key] = parseInt(e.target.value, 10) || 0;
            renderAbilities();
        }
    });
});