import { useState } from 'react';

const INITIAL_STATE = {
    history: [],
    selectedGenres: [],
    selectedThemes: [],
    language: "id",
    char: { name: "", hp: 100, maxHp: 100, stats: {} },
    inventory: [],
    summary: "",
    isGameOver: false,

    // UI State
    activeScreen: 'language', // 'language', 'menu', 'character', 'game'
    isSettingsModalOpen: false,
    isInventoryOpen: false,
};

export const useGame = () => {
    const [state, setState] = useState(INITIAL_STATE);

    const setLanguage = (lang) => {
        setState(prevState => ({ ...prevState, language: lang, activeScreen: 'menu' }));
        // After setting language, we should check for API key
        const key = localStorage.getItem('gemini_api_key') || '';
        if (!key) {
            setState(prevState => ({ ...prevState, isSettingsModalOpen: true }));
        }
    };

    const openSettingsModal = () => {
        setState(prevState => ({ ...prevState, isSettingsModalOpen: true }));
    };

    const closeSettingsModal = () => {
        setState(prevState => ({ ...prevState, isSettingsModalOpen: false }));
    };

    // ... other state management functions will go here ...

    return {
        state,
        actions: {
            setLanguage,
            openSettingsModal,
            closeSettingsModal,
            // ...
        }
    };
};
