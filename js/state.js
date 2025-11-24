// STATE 
export let state = { 
    history: [],  
    selectedGenres: [],  
    selectedThemes: [],  
    language: "id", // 'id' or 'en'
    char: { name: "", hp: 100, maxHp: 100, stats: {} },
    inventory: [],  
    summary: "", isGameOver: false 
}; 

export function setState(newState) {
    state = newState;
}

export function resetState() {
    // Preserve language
    const currentLang = state.language;
    state = { 
        history: [],  
        selectedGenres: [],  
        selectedThemes: [],  
        language: currentLang,
        char: { name: "", hp: 100, maxHp: 100, stats: {} },
        inventory: [],  
        summary: "", isGameOver: false 
    };
}
