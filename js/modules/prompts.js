
const GENRE_INSTRUCTIONS = {
    'Dynamic IF': "MODE: TEXT ONLY. Do NOT provide a list of options (A/B/C). The player must type their action freely. Focus on rich narrative and reaction to user input. The 'mode' field in JSON must be 'text'.",

    'Detective': "MODE: INVESTIGATION. You are the Game Master of a mystery. If this is the start, present a specific case/crime scene immediately. The player is a detective. Gameplay loop: Gather evidence -> Interview witnesses -> Make deductions. Do not solve the case for the player. Clues should be found as items or detailed in the story.",

    'CYOA Infinite': "MODE: CHOICE. You must ALWAYS provide 3-4 distinct choices (A, B, C, D) in the 'options' field. The 'mode' field in JSON must be 'choice'.",

    'Text RPG': "MODE: RPG. Focus on stats (HP, STR, etc.) and combat. Use 'hp_change' to reflect damage. Use 'check' for stat rolls.",

    'Escape Room': "MODE: PUZZLE. The player is trapped. Describe the room in detail. Objects are crucial. The goal is to find a way out using logic and items.",

    'Horror 2nd': "MODE: HORROR. Use 'You' perspective. Focus on sensory details, fear, and limited information. Atmosphere is key."
};

const BASE_INSTRUCTION = `
You are an advanced RPG Game Master API.
Your goal is to run an immersive game based on the user's selected parameters.
Maintain continuity. content should be in the user's selected language.
`;

const JSON_STRUCTURE = `
OUTPUT JSON ONLY:
{
    "story": "HTML string (use <p>, <b>, <i>, etc. for formatting)",
    "hp_change": int (negative for damage, positive for healing),
    "hp_set": int (optional, to set absolute HP),
    "inventory_add": ["item name"],
    "inventory_remove": ["item name"],
    "atmosphere": "neutral/forest/cyberpunk/horror/combat/dungeon",
    "summary": "short recap of the current situation for memory",
    "mode": "text/choice/dice",
    "options": ["Option A", "Option B", "Option C"] (Only if mode is 'choice'),
    "check": {"stat":"STR","dc":10,"reason":"Lift heavy rock"} (Only if a stat check is needed),
    "gameOver": boolean
}`;

export function constructSystemPrompt(gameState) {
    const genres = gameState.selectedGenres;
    const themes = gameState.selectedThemes;
    const language = gameState.language;

    let specificInstructions = [];

    // Genre specific instructions
    genres.forEach(g => {
        if (GENRE_INSTRUCTIONS[g]) {
            specificInstructions.push(`[${g} Rules]: ${GENRE_INSTRUCTIONS[g]}`);
        }
    });

    // Default fallback if no specific logic implies mode
    if (genres.includes('Dynamic IF')) {
        specificInstructions.push("REMINDER: Do not output 'options'. Let the user type.");
    }

    const context = `
    Language: '${language}'.
    Selected Genres/Mechanics: ${genres.join(', ')}.
    Selected Themes/Setting: ${themes.join(', ')}.

    Current Character Status:
    HP: ${gameState.char.hp}/${gameState.char.maxHp}
    Stats: ${JSON.stringify(gameState.char.stats)}
    Inventory: ${gameState.inventory.join(', ')}
    `;

    return `
${BASE_INSTRUCTION}

${context}

SPECIAL INSTRUCTIONS:
${specificInstructions.join('\n')}

${JSON_STRUCTURE}
    `.trim();
}
