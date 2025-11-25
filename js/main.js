import { state, setState } from './state.js';
import { init as initSetup, toggleGenre, toggleTheme, handleMenuNext } from './screens/setup.js';
import { startGame, initCharacterCreation, backToSetup } from './screens/character.js';
import { toggleInventoryView, toggleCraftingMode, executeCraft, handleItemAction, closePopup, renderInventory } from './modules/inventory.js';
import { submitAction, rollDice } from './screens/game.js';
import { printLog, updateStatusUI, applyTranslations } from './modules/ui.js';
import { fetchAvailableModels, checkApiKeyValidity } from './api.js';

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
window.handleApiKeyCheck = handleApiKeyCheck; // Expose the new function

// Language Selection
window.submitLanguageSelection = function() {
    const input = document.getElementById('input-language');
    const lang = input.value.trim() || 'Indonesia';
    state.language = lang;

    applyTranslations();
    document.getElementById('screen-language').style.display = 'none';

    // Check for API key *after* language selection, before showing the next screen
    checkApiKeyOnLoad();

    document.getElementById('screen-menu').style.display = 'flex';
    initSetup();
};

// --- API KEY SETTINGS ---
function populateModelDropdown(models, selectedModel) {
    const select = document.getElementById('select-gemini-model');
    select.innerHTML = ''; // Clear existing options

    if (models.length === 0) {
        const defaultOption = document.createElement('option');
        defaultOption.value = 'gemini-1.5-flash';
        defaultOption.textContent = 'gemini-1.5-flash (Default)';
        select.appendChild(defaultOption);
        return;
    }

    models.forEach(modelName => {
        const option = document.createElement('option');
        // The value should be the part after "models/"
        const modelId = modelName.split('/').pop();
        option.value = modelId;
        option.textContent = modelId;
        if (modelId === selectedModel) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

window.openSettings = function() {
    const key = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('input-api-key').value = key;
    document.getElementById('modal-settings').style.display = 'flex';

    // Clear any previous feedback when opening
    const feedbackEl = document.getElementById('api-key-feedback');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback-text';


    const storedModels = JSON.parse(localStorage.getItem('gemini_models') || '[]');
    const selectedModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';

    populateModelDropdown(storedModels, selectedModel);
};

window.closeSettings = function() {
    document.getElementById('modal-settings').style.display = 'none';
    const key = localStorage.getItem('gemini_api_key') || '';
    if (!key) {
        document.getElementById('btn-settings').classList.add('notify');
    }
    // Also clear feedback on close
    const feedbackEl = document.getElementById('api-key-feedback');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback-text';
};

window.saveApiKey = async function() {
    const input = document.getElementById('input-api-key');
    const key = input.value.trim();
    const modelSelect = document.getElementById('select-gemini-model');

    if (!key) {
        alert("API Key cannot be empty.");
        return;
    }

    // Store selected model
    localStorage.setItem('gemini_model', modelSelect.value);

    // Fetch and store models if the key is new or changed
    const oldKey = localStorage.getItem('gemini_api_key');
    if (key !== oldKey) {
        localStorage.setItem('gemini_api_key', key);
        modelSelect.innerHTML = '<option value="">Memuat model...</option>';

        const models = await fetchAvailableModels(key);

        localStorage.setItem('gemini_models', JSON.stringify(models));
        populateModelDropdown(models, modelSelect.value);
    }

    alert("Pengaturan Disimpan!");
    document.getElementById('btn-settings').classList.remove('notify');
    closeSettings();
};

async function handleApiKeyCheck() {
    const input = document.getElementById('input-api-key');
    const key = input.value.trim();
    const feedbackEl = document.getElementById('api-key-feedback');
    const checkBtn = document.getElementById('btn-check-api');

    // Reset feedback
    feedbackEl.textContent = 'Mengecek...';
    feedbackEl.className = 'feedback-text show loading';
    checkBtn.disabled = true;

    try {
        const result = await checkApiKeyValidity(key);

        feedbackEl.textContent = result.message;
        if (result.success) {
            feedbackEl.className = 'feedback-text show success';
        } else {
            feedbackEl.className = 'feedback-text show error';
        }
    } catch (e) {
        feedbackEl.textContent = 'Terjadi error yang tidak diketahui.';
        feedbackEl.className = 'feedback-text show error';
    } finally {
        checkBtn.disabled = false;
    }
}

function checkApiKeyOnLoad() {
    const key = localStorage.getItem('gemini_api_key') || '';
    if (!key) {
        // Initially open settings if no key is found
        openSettings();
    }
}

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

// --- SIDEBAR LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleSidebar() {
        hamburgerIcon.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    hamburgerIcon.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
});
