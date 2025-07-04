import { loadData, saveData } from "./storage.js";

// In js/main.js, sostituisci il vecchio oggetto App con questo

const App = {
  // Dati dell'applicazione
  data() {
    return {
      characterData: null, // Verrà caricato da storage.js
      isEditMode: false,
      damageHealAmount: 1, // Valore per l'input di danno/cura
      SKILL_MAP: {
          str: ["athletics"],
          dex: ["acrobatics", "sleightOfHand", "stealth"],
          int: ["arcana", "history", "investigation", "nature", "religion"],
          wis: ["animalHandling", "insight", "medicine", "perception", "survival"],
          cha: ["deception", "intimidation", "performance", "persuasion"],
      }
      
    }
  },

  // Proprietà calcolate: valori che dipendono da altri dati
  computed: {
    hpPercent() {
      if (!this.characterData || this.characterData.hp.max === 0) return 0;
      return (this.characterData.hp.current / this.characterData.hp.max) * 100;
    },
    tempHpPercent() {
        if (!this.characterData || this.characterData.hp.max === 0) return 0;
        return (this.characterData.hp.temp / this.characterData.hp.max) * 100;
    },
    barColor() {
      if (this.hpPercent > 50) return "var(--c-success)";
      if (this.hpPercent > 25) return "#f39c12";
      return "var(--c-danger)";
    },
    initiative() {
        if (!this.characterData) return 0;
        return Math.floor((this.characterData.abilities.dex - 10) / 2);
    }
  },

  // Metodi: le funzioni che possiamo chiamare dal nostro HTML
  methods: {
    save() {
        // Un unico metodo per salvare, così non ci ripetiamo
        saveData(this.characterData);
    },
    applyDamage() {
      let damageToDeal = this.damageHealAmount;
      if (this.characterData.hp.temp > 0) {
        if (damageToDeal <= this.characterData.hp.temp) {
          this.characterData.hp.temp -= damageToDeal;
          damageToDeal = 0;
        } else {
          damageToDeal -= this.characterData.hp.temp;
          this.characterData.hp.temp = 0;
        }
      }
      if (damageToDeal > 0) {
        this.characterData.hp.current = Math.max(0, this.characterData.hp.current - damageToDeal);
      }
      this.save();
    },
    applyHeal() {
      this.characterData.hp.current = Math.min(this.characterData.hp.max, this.characterData.hp.current + this.damageHealAmount);
      this.save();
    },
    changeTempHp(amount) {
      this.characterData.hp.temp = Math.max(0, this.characterData.hp.temp + amount);
      this.save();
    },
     toggleHitDice(index) {
        this.characterData.hitDice.diceStates[index] = !this.characterData.hitDice.diceStates[index];
        this.save();
    },
    toggleDeathSave(type, index) {
        const key = type === 'success' ? 'successes' : 'failures';
        this.characterData.deathSaves[key] = (this.characterData.deathSaves[key] === index + 1) ? index : index + 1;
        this.save();
    },
     changeHitDiceTotal(amount) {
        const newTotal = Math.max(0, this.characterData.hitDice.total + amount);
        this.characterData.hitDice.total = newTotal;
        // Adegua la lunghezza dell'array di stati
        while (this.characterData.hitDice.diceStates.length < newTotal) {
            this.characterData.hitDice.diceStates.push(false);
        }
        this.characterData.hitDice.diceStates.length = newTotal;
        this.save();
    },
    changeHitDiceType(type) {
        this.characterData.hitDice.type = type;
        this.save();
    },
    toggleEditMode() {
        if(this.isEditMode) {
            this.save(); // Salva quando si esce dalla modalità modifica
        }
        this.isEditMode = !this.isEditMode;
    },
    getModifier(abilityKey) {
        if (!this.characterData) return 0;
        const score = this.characterData.abilities[abilityKey];
        return Math.floor((score - 10) / 2);
    },
    getSavingThrowBonus(abilityKey) {
        if (!this.characterData) return 0;
        const modifier = this.getModifier(abilityKey);
        const isProficient = this.characterData.savingThrows[abilityKey];
        return modifier + (isProficient ? this.characterData.proficiencyBonus : 0);
    },
    getSkillBonus(skillName, abilityKey) {
        if (!this.characterData) return 0;
        const modifier = this.getModifier(abilityKey);
        const isProficient = this.characterData.skills[skillName].proficient;
        return modifier + (isProficient ? this.characterData.proficiencyBonus : 0);
    },
    formatSkillName(skillName) {
        // Funzione puramente estetica per formattare i nomi (es. "sleightOfHand" -> "Sleight Of Hand")
        return skillName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    addAttack() {
        this.characterData.attacks.push({
            name: "Nuovo Attacco",
            bonus: "+0",
            damage: "1d4",
            notes: ""
        });
        this.save();
    },
    deleteAttack(index) {
        if (confirm("Sei sicuro di voler cancellare questo attacco?")) {
            this.characterData.attacks.splice(index, 1);
            this.save();
        }
    },
    addFeature() {
        this.characterData.features.push({ name: "Nuovo Privilegio", description: "Descrizione..." });
        this.save();
    },
    deleteFeature(index) {
        if (confirm("Sei sicuro di voler cancellare questo privilegio?")) {
            this.characterData.features.splice(index, 1);
            this.save();
        }
    },
    addEquipment() {
        this.characterData.equipment.push({ name: "Nuovo Oggetto", quantity: 1 });
        this.save();
    },
    deleteEquipment(index) {
        if (confirm("Sei sicuro di voler cancellare questo oggetto?")) {
            this.characterData.equipment.splice(index, 1);
            this.save();
        }
      }
  },

  // Funzione eseguita quando l'app è pronta
  async mounted() {
    this.characterData = await loadData();
    // Aggiungiamo un listener per il bottone di modifica
    const editBtn = document.getElementById('edit-mode-btn');
    if(editBtn) editBtn.addEventListener('click', this.toggleEditMode);
  }
};

// Creiamo e montiamo l'app Vue nel nostro div #app
Vue.createApp(App).mount('#app');