import { state, setState } from './state.js';
import { model } from './config.js';
import { printLog, updateStatusUI, setAtmosphere } from './modules/ui.js';
import { renderInventory, updateCraftUI } from './modules/inventory.js';
import { setMode } from './screens/game.js';

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

    try { 
        const sys = ` 
        RPG GM. Language: '${state.language}'. 
        Mechanics: ${state.selectedGenres.join(', ')}.  
        Setting: ${state.selectedThemes.join(', ')}. 
        OUTPUT JSON ONLY: 
        { 
            "story": "HTML string", 
            "hp_change": int, 
            "hp_set": int, 
            "inventory_add": ["item"], 
            "inventory_remove": ["item"], 
            "atmosphere": "neutral/forest/cyberpunk/horror/combat/dungeon",  
            "summary": "recap", 
            "mode": "text/choice/dice", 
            "options": ["opt1"], 
            "check": {"stat":"STR","dc":10,"reason":""}, 
            "gameOver": boolean 
        }`; 

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${storedKey}`, {
            method: 'POST', headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ contents: state.history, systemInstruction: { parts: [{ text: sys }] } }) 
        }); 

        const data = await response.json(); 
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim(); 
        const res = JSON.parse(jsonText); 

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
            document.getElementById('interaction-area').style.display = 'none'; 
            return; 
        } 

        setMode(res.mode, res); 

    } catch (e) { 
        console.error(e); 
        printLog("Gangguan koneksi...", 'system-msg'); 
        state.history.pop(); 
    } finally { 
        btns.forEach(b => b.disabled = false); 
        updateCraftUI();  
    } 
} 
