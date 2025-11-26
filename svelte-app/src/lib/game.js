import { get } from 'svelte/store';
import { gameState } from '$lib/store.js';
import { model } from '$lib/config.js';
import { PUBLIC_GEMINI_API_KEY } from '$env/static/public';

export async function processTurn(userInput, isHidden = false) {
    const state = get(gameState);

    if (!isHidden) {
        gameState.update(s => ({ ...s, history: [...s.history, { role: 'user', text: userInput }] }));
    }

    gameState.update(s => ({ ...s, isLoading: true }));

    // --- LOGIC MOVED FROM +server.js ---
    const context = `[HP:${state.char.hp}/${state.char.maxHp}][INV:${state.inventory.join(',')}] ${userInput}`;
    const historyForAPI = [...state.history.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: "user", parts: [{ text: context }] }];

    const sys = `
        RPG GM. Language: '${state.language}'.
        Mechanics: ${state.selectedGenres.join(', ')}.
        Setting: ${state.selectedThemes.join(', ')}.
        OUTPUT JSON ONLY:
        {
            "story": "HTML string", "hp_change": int, "hp_set": int, "inventory_add": ["item"],
            "inventory_remove": ["item"], "atmosphere": "string", "summary": "recap",
            "mode": "text/choice/dice", "options": ["opt1"],
            "check": {"stat":"STR","dc":10,"reason":""}, "gameOver": boolean
        }`;
    // --- END OF MOVED LOGIC ---

    try {
        // --- DIRECT API CALL ---
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${PUBLIC_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: historyForAPI,
                systemInstruction: { parts: [{ text: sys }] }
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API request failed: ${errorText}`);
        }

        const data = await apiResponse.json();
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const res = JSON.parse(jsonText);
        // --- END OF DIRECT API CALL ---


        // Update the store with the response from the Gemini API
        gameState.update(s => {
            let newHp = s.char.hp;
            if (res.hp_set) {
                newHp = res.hp_set;
            }
            if (res.hp_change) {
                newHp = Math.max(0, Math.min(s.char.maxHp, newHp + res.hp_change));
            }

            let newInventory = [...s.inventory];
            if (res.inventory_add) {
                newInventory.push(...res.inventory_add);
            }
            if (res.inventory_remove) {
                res.inventory_remove.forEach(itemToRemove => {
                    const index = newInventory.findIndex(i => i.toLowerCase().includes(itemToRemove.toLowerCase()));
                    if (index > -1) {
                        newInventory.splice(index, 1);
                    }
                });
            }

            return {
                ...s,
                history: [...s.history, { role: 'model', text: res.story }],
                summary: res.summary,
                char: { ...s.char, hp: newHp },
                inventory: newInventory,
                isGameOver: res.gameOver || newHp <= 0,
                gameMode: res.mode,
                gameOptions: res.options,
                diceCheck: res.check
            };
        });

    } catch (e) {
        console.error(e);
        gameState.update(s => ({ ...s, history: [...s.history, { role: 'system', text: `Error: ${e.message}` }] }));
    } finally {
        gameState.update(s => ({ ...s, isLoading: false }));
    }
}
