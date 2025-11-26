import { writable } from 'svelte/store';

export const gameState = writable({
    history: [],
    selectedGenres: [],
    selectedThemes: [],
    language: "Indonesia",
    char: { name: "", hp: 100, maxHp: 100, stats: {STR:3, INT:3, DEX:3, CHA:3} },
    inventory: [],
    summary: "",
    isGameOver: false,
    isLoading: false,

    // UI State
    currentScreen: 'setup', // 'setup', 'character', 'game'
    isInventoryVisible: false,
    isCraftingMode: false,

    // Game Interaction State
    gameMode: 'text', // 'text', 'choice', 'dice'
    gameOptions: [],
    diceCheck: null
});
