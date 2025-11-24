// STATE 
export let state = { 
    history: [],  
    selectedGenres: [],  
    selectedThemes: [],  
    language: "Indonesia", 
    char: { name: "", hp: 100, maxHp: 100, stats: {STR:3, INT:3, DEX:3, CHA:3} }, 
    inventory: [],  
    summary: "", isGameOver: false 
}; 

export function setState(newState) {
    state = newState;
}

export function resetState() {
    state = { 
        history: [],  
        selectedGenres: [],  
        selectedThemes: [],  
        language: "Indonesia", 
        char: { name: "", hp: 100, maxHp: 100, stats: {STR:3, INT:3, DEX:3, CHA:3} }, 
        inventory: [],  
        summary: "", isGameOver: false 
    };
}
