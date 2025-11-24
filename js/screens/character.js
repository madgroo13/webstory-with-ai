import { state } from '../state.js';
import { renderInventory } from '../modules/inventory.js';
import { updateStatusUI, applyTranslations } from '../modules/ui.js';
import { TRANSLATIONS } from '../modules/localization.js';
import { processTurn, generateCharacterForm } from '../api.js';

// Global cache for form data
let currentFormFields = [];

export async function initCharacterCreation() {
    // 1. Show Loading
    document.getElementById('screen-menu').style.display = 'none';
    document.getElementById('screen-char').style.display = 'flex';

    const container = document.getElementById('ai-char-form');
    const lang = state.language || 'id';
    container.innerHTML = `<div style="text-align:center; padding:50px; color:#aaa; font-style:italic;">${TRANSLATIONS[lang]['loading-form']}</div>`;

    // Hide Start Button
    const startBtn = document.querySelector('#screen-char button[onclick="startGame()"]');
    if(startBtn) startBtn.style.display = 'none';

    // 2. Call API
    const formData = await generateCharacterForm();

    if (!formData) {
        container.innerHTML = `<div style="color:var(--danger); text-align:center;">Failed to generate form. Please check API Key.</div>`;
        return;
    }

    // 3. Render Form
    renderForm(formData, container);
    if(startBtn) startBtn.style.display = 'block';
}

function renderForm(data, container) {
    container.innerHTML = '';
    currentFormFields = data.fields; // Store for retrieval

    // Intro Text
    if (data.intro_text) {
        const intro = document.createElement('div');
        intro.style.marginBottom = '20px';
        intro.style.fontStyle = 'italic';
        intro.style.color = '#ddd';
        intro.innerHTML = data.intro_text;
        container.appendChild(intro);
    }

    // Fields
    data.fields.forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        if(field.desc) {
            const small = document.createElement('small');
            small.style.color = '#aaa';
            small.style.fontSize = '0.8em';
            small.style.marginLeft = '10px';
            small.textContent = field.desc;
            label.appendChild(small);
        }
        wrapper.appendChild(label);

        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                input.appendChild(o);
            });
        } else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else if (field.type === 'number') {
            input = document.createElement('input');
            input.type = 'number';
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        input.id = `field-${field.key}`;
        if(field.default) input.value = field.default;

        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });
}

export function backToSetup() {
    document.getElementById('screen-char').style.display = 'none';
    document.getElementById('screen-menu').style.display = 'flex';
    document.getElementById('ai-char-form').innerHTML = '';
    currentFormFields = [];
}

export function startGame() { 
    state.char.name = document.getElementById('char-name').value || "Hero"; 

    // Collect Form Data
    const charDetails = {};
    currentFormFields.forEach(field => {
        const el = document.getElementById(`field-${field.key}`);
        if(el) charDetails[field.label] = el.value;
    });

    // Show UI
    document.getElementById('screen-char').style.display = 'none'; 
    document.getElementById('status-bar').style.display = 'flex'; 
    document.getElementById('inventory-area').style.display = 'flex';  
    document.getElementById('input-area').style.display = 'flex'; 

    const setupInfo = document.getElementById('current-setup');
    if (setupInfo) {
        setupInfo.textContent = `${state.selectedGenres.join(', ')} | ${state.selectedThemes.join(', ')}`;
    }

    // Initialize History with "First Turn" prompt
    // We tell the AI the user's choices and ask it to initialize the game stats + story
    const prompt = `
    INITIATE GAME.
    User Character Details:
    Name: ${state.char.name}
    ${JSON.stringify(charDetails, null, 2)}

    INSTRUCTION:
    1. Initialize the character's stats (HP, Inventory, and Custom Stats like Sanity/Credits/Mana) based on the details above and the Genre/Theme.
    2. Start the story introduction.
    3. Output the usual JSON format, ensuring 'stats' are populated in the logical way for this genre.
    `;

    // We use processTurn but we need it to handle the *initial* stat setup which it usually doesn't do explicitly besides HP.
    // Wait, processTurn updates state.char.stats only if we tell it to.
    // The current processTurn only looks for hp_set, hp_change.
    // I need to update processTurn to accept a generic "stats_set" or similar?
    // OR I can trust the AI to handle it via story context, but for the UI to update, I need the data.

    // Let's rely on a specific field "stats_set" in the response for the first turn?
    // I need to update api.js to handle 'stats_set' if I want the UI to reflect it.

    processTurn(prompt, true); 
} 
