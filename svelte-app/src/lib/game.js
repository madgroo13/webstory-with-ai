import { get } from 'svelte/store';
import { gameState } from '$lib/store.js';

export async function processTurn(userInput, isHidden = false) {
    const state = get(gameState);

    if (!isHidden) {
        gameState.update(s => ({ ...s, history: [...s.history, { role: 'user', text: userInput }] }));
    }

    gameState.update(s => ({ ...s, isLoading: true }));

    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: state.history,
                language: state.language,
                selectedGenres: state.selectedGenres,
                selectedThemes: state.selectedThemes,
                char: state.char,
                inventory: state.inventory,
                userInput: userInput
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const res = await response.json();

        // Update the store with the response from our local API endpoint
        gameState.update(s => {
            let newHp = s.char.hp;
            if (res.hp_set) {
                newHp = res.hp_set;
            }
            if (res.hp_change) {
                // Correct HP calculation: clamp between 0 and maxHp
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
