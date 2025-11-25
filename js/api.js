import { state, setState } from './state.js';
import { printLog, updateStatusUI, setAtmosphere } from './modules/ui.js';
import { renderInventory, updateCraftUI } from './modules/inventory.js';
import { setMode } from './screens/game.js';
import { constructSystemPrompt, constructCharFormPrompt } from './modules/prompts.js';
import { TRANSLATIONS, getEffectiveLanguage } from './modules/localization.js';

export async function processTurn(userInput, isHidden = false) { 
    const storedKey = localStorage.getItem('gemini_api_key');
    if (!storedKey) {
        alert("Silakan masukkan API Key Google Gemini Anda di menu Settings (⚙️).");
        window.openSettings();
        return;
    }

    if (!isHidden) printLog(userInput, 'user-msg'); 
    document.getElementById('user-input').value = ''; 
    const context = `[HP:${state.char.hp}/${state.char.maxHp}][INV:${state.inventory.join(',')}] ` + userInput; 
    state.history.push({ role: "user", parts: [{ text: context }] }); 
     
    const btns = document.querySelectorAll('button'); btns.forEach(b => b.disabled = true); 

    // Loading Indicator
    let loadingEl = null;
    const lang = getEffectiveLanguage(state.language);
    const thinkingText = TRANSLATIONS[lang]['txt-thinking'];

    if (!isHidden) {
        loadingEl = printLog(thinkingText, 'system-msg');
    }

    try { 
        const sys = constructSystemPrompt(state);
        const selectedModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${storedKey}`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ contents: state.history, systemInstruction: { parts: [{ text: sys }] } }) 
        }); 

        const data = await response.json(); 
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim(); 
        const res = JSON.parse(jsonText); 

        // Remove loading
        if (loadingEl) loadingEl.remove();

        state.summary = res.summary; 
        state.history.push({ role: "model", parts: [{ text: jsonText }] }); 
         
        if (res.hp_set) { state.char.hp = res.hp_set; state.char.maxHp = res.hp_set; } 
        if (res.hp_change) { 
            state.char.hp = Math.max(0, Math.min(state.char.maxHp, state.char.hp + res.hp_change)); 
            if(res.hp_change < 0) { 
                document.getElementById('game-container').classList.add('shake-effect'); 
                setTimeout(() => document.getElementById('game-container').classList.remove('shake-effect'), 500); 
                printLog(`Damage: ${res.hp_change}`, 'system-msg damage-text'); 
            } 
        } 

        // Handle Dynamic Stats
        if (res.stats_set) {
            Object.keys(res.stats_set).forEach(key => {
                state.char.stats[key] = res.stats_set[key];
            });
        }

        if(res.inventory_add) res.inventory_add.forEach(i => state.inventory.push(i)); 
        if(res.inventory_remove) { 
            res.inventory_remove.forEach(rem => { 
                const idx = state.inventory.findIndex(i => i.toLowerCase().includes(rem.toLowerCase())); 
                if(idx > -1) state.inventory.splice(idx, 1); 
            }); 
        } 
        renderInventory(); 
        setAtmosphere(res.atmosphere); 
        printLog(res.story, 'log-entry'); 
        updateStatusUI(); 

        if (state.char.hp <= 0 || res.gameOver) { 
            printLog("<h2>☠️ GAME OVER</h2>", 'system-msg damage-text'); 
            document.getElementById('input-area').style.display = 'none';
            return; 
        } 

        setMode(res.mode, res); 

    } catch (e) { 
        console.error(e); 
        if (loadingEl) loadingEl.remove();
        printLog("Gangguan koneksi...", 'system-msg'); 
        state.history.pop(); 
    } finally { 
        btns.forEach(b => b.disabled = false); 
        updateCraftUI();  
    } 
} 

export async function generateCharacterForm() {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (!storedKey) {
        alert("API Key required!");
        window.openSettings();
        return null;
    }

    const prompt = constructCharFormPrompt(state.selectedGenres, state.selectedThemes, state.language);
    const selectedModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${storedKey}`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Form generation failed:", e);
        return null;
    }
}

export async function fetchAvailableModels(apiKey) {
    if (!apiKey) return [];

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error("Failed to fetch models:", response.statusText);
            return [];
        }
        const data = await response.json();

        // Filter models that can be used for chat/text generation
        const compatibleModels = data.models.filter(model =>
            model.supportedGenerationMethods.includes("generateContent")
        );

        // Return just the names of the models
        return compatibleModels.map(model => model.name);

    } catch (e) {
        console.error("Error fetching available models:", e);
        return [];
    }
}

export async function checkApiKeyValidity(apiKey) {
    if (!apiKey) {
        return { success: false, message: "API Key tidak boleh kosong." };
    }

    const testModel = 'gemini-1.5-flash'; // Use a known, efficient model for the check
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:countTokens?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hello" }] }] })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: "API Key valid dan berfungsi!" };
        }

        // Handle specific API errors
        if (response.status === 400) {
            return { success: false, message: "API Key tidak valid atau salah format. Pastikan Anda menyalinnya dengan benar." };
        }
        if (response.status === 429) {
            return { success: false, message: "Kuota API habis atau Anda telah mencapai batas permintaan. Coba lagi nanti." };
        }
        if (data.error && data.error.message) {
            return { success: false, message: `Error: ${data.error.message}` };
        }

        return { success: false, message: `Gagal memvalidasi. Status: ${response.status}` };

    } catch (e) {
        console.error("API Key check failed:", e);
        return { success: false, message: "Gagal terhubung ke server Google. Periksa koneksi internet Anda." };
    }
}
