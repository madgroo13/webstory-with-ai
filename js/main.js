import { state, setState } from './state.js';
import { init as initSetup, toggleGenre, toggleTheme, handleMenuNext } from './screens/setup.js';
import { startGame, initCharacterCreation, backToSetup } from './screens/character.js';
import { toggleInventoryView, toggleCraftingMode, executeCraft, handleItemAction, closePopup, renderInventory } from './modules/inventory.js';
import { submitAction, rollDice } from './screens/game.js';
import { printLog, updateStatusUI, applyTranslations } from './modules/ui.js';

// Expose functions to window for HTML event handlers
window.toggleInventoryView = toggleInventoryView;
window.exportSave = exportSave;
window.importSave = importSave;
window.confirmReset = confirmReset;
window.toggleCraftingMode = toggleCraftingMode;
window.executeCraft = executeCraft;
window.handleItemAction = handleItemAction;
window.closePopup = closePopup;
window.submitAction = submitAction;
window.rollDice = rollDice;
window.toggleGenre = toggleGenre;
window.toggleTheme = toggleTheme;
window.handleMenuNext = handleMenuNext;
window.startGame = startGame;
window.initCharacterCreation = initCharacterCreation;
window.backToSetup = backToSetup;

// Language Selection
window.submitLanguageSelection = function() {
    const input = document.getElementById('input-language');
    const lang = input.value.trim() || 'Indonesia';
    state.language = lang;

    applyTranslations();
    document.getElementById('screen-language').style.display = 'none';
    document.getElementById('screen-menu').style.display = 'flex';
    initSetup();
};

// --- API KEY SETTINGS ---
window.openSettings = function() {
    const key = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('input-api-key').value = key;
    document.getElementById('modal-settings').style.display = 'flex';
};

window.closeSettings = function() {
    document.getElementById('modal-settings').style.display = 'none';
};

window.saveApiKey = function() {
    const input = document.getElementById('input-api-key');
    const key = input.value.trim();
    if(key) {
        localStorage.setItem('gemini_api_key', key);
        alert("API Key Saved!");
        closeSettings();
    } else {
        alert("API Key cannot be empty.");
    }
};

function exportSave() { 
    const blob = new Blob([JSON.stringify(state)], {type:'application/json'}); 
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `rpg_save_${Date.now()}.json`; a.click(); 
} 

function importSave(inp) { 
    const r = new FileReader(); 
    r.onload = e => {  
        setState(JSON.parse(e.target.result));  
        document.getElementById('screen-language').style.display = 'none';
        document.getElementById('screen-menu').style.display = 'none'; 
        document.getElementById('screen-char').style.display = 'none'; 
        document.getElementById('status-bar').style.display = 'flex'; 
        if(state.inventory && state.inventory.length > 0) renderInventory(); 
        document.getElementById('input-area').style.display = 'flex';
        updateStatusUI();
        applyTranslations(); // Re-apply language from save
        printLog("<i>Loaded.</i>", "system-msg");  
    }; 
    r.readAsText(inp.files[0]); 
} 

function confirmReset() { if(confirm("Reset?")) location.reload(); } 

// Init
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key==='Enter') submitAction(); }); 
// Removed automatic initSetup(), it will happen after language selection
