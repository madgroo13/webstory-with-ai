import { state } from '../state.js';
import { getStartingInventory, renderInventory } from '../modules/inventory.js';
import { updateStatusUI } from '../modules/ui.js';
import { processTurn } from '../api.js';

let tempPoints = 10;
let tempStats = {STR:0,INT:0,DEX:0,CHA:0};

export function modStat(stat, val) { 
    if (val > 0 && tempPoints > 0) { tempStats[stat]++; tempPoints--; } 
    else if (val < 0 && tempStats[stat] > 0) { tempStats[stat]--; tempPoints++; } 
    document.getElementById('points-val').textContent = tempPoints; 
    document.getElementById(`val-${stat}`).textContent = tempStats[stat]; 
} 

export function startGame() { 
    state.char.name = document.getElementById('char-name').value || "Hero"; 
    state.language = document.getElementById('char-lang').value || "Indonesia"; 
    Object.keys(tempStats).forEach(k => state.char.stats[k] = 3 + tempStats[k]); 
    state.inventory = getStartingInventory(state.selectedGenres, state.selectedThemes); 

    document.getElementById('screen-char').style.display = 'none'; 
    document.getElementById('status-bar').style.display = 'flex'; 
    document.getElementById('inventory-area').style.display = 'flex';  
    document.getElementById('input-area').style.display = 'flex'; 
    updateStatusUI(); 
    renderInventory(); 

    const prompt = ` 
    INITIATE GAME. 
    Language: ${state.language}. 
    Game Style: ${state.selectedGenres.join(', ')}. 
    World Themes: ${state.selectedThemes.join(', ')}. 
    Character: ${state.char.name}. 
    Stats: ${JSON.stringify(state.char.stats)}. 
    Inventory: ${JSON.stringify(state.inventory)}. 
    Instruction: Create an intro story combining the mechanics of ${state.selectedGenres} with the setting of ${state.selectedThemes}. 
    `; 
    processTurn(prompt, true); 
} 
