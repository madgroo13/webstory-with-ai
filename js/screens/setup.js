import { state } from '../state.js';
import { GENRE_DEFINITIONS, WORLD_THEMES } from '../config.js';
import { updateBackgroundFromSelection } from '../modules/ui.js';
import { TRANSLATIONS } from '../modules/localization.js';

export function resetSetupState() {
    // No step logic anymore
}

export function init() { 
    const gGrid = document.getElementById('genre-list'); 
    gGrid.innerHTML = '';
    Object.keys(GENRE_DEFINITIONS).forEach(key => { 
        const def = GENRE_DEFINITIONS[key]; 
        const btn = document.createElement('div'); 
        btn.className = 'toggle-btn'; 
        btn.dataset.key = key;
        btn.innerHTML = `<strong>${key}</strong><small>${def.desc}</small>`; 
        btn.onclick = () => toggleGenre(key, btn); 
        gGrid.appendChild(btn); 
    }); 

    const tGrid = document.getElementById('theme-list'); 
    tGrid.innerHTML = '';
    WORLD_THEMES.forEach(theme => { 
        const btn = document.createElement('div'); 
        btn.className = 'toggle-btn'; 
        btn.textContent = theme; 
        btn.onclick = () => toggleTheme(theme, btn); 
        tGrid.appendChild(btn); 
    }); 

    // Remove old stat listeners as we don't have them anymore
    updateGenreButtonStates();
    updateNextButton();
} 

function updateGenreButtonStates() {
    const disabledGenres = new Set();
    state.selectedGenres.forEach(selected => {
        const conflicts = GENRE_DEFINITIONS[selected]?.conflicts || [];
        conflicts.forEach(c => disabledGenres.add(c));
    });

    const gGrid = document.getElementById('genre-list');
    if (!gGrid) return;

    const buttons = gGrid.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
        const key = btn.dataset.key;
        if (!key) return;

        if (disabledGenres.has(key) && !state.selectedGenres.includes(key)) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

function updateNextButton() {
    // Enable if at least 1 genre and 1 theme selected
    // Or just 1 genre? User requirements implies both.
    // "Pilih Genre & Tema dalam satu layar"
    const hasGenre = state.selectedGenres.length > 0;
    const hasTheme = state.selectedThemes.length > 0;
    document.getElementById('btn-next').disabled = !(hasGenre && hasTheme);
}

export function toggleGenre(key, btn) { 
    if(state.selectedGenres.includes(key)) { 
        state.selectedGenres = state.selectedGenres.filter(k => k !== key); 
        btn.classList.remove('active'); 
    } else { 
        if(state.selectedGenres.length < 3) { 
            state.selectedGenres.push(key); 
            btn.classList.add('active'); 
        } 
    } 
    updateBackgroundFromSelection(); 
    updateGenreButtonStates();
    updateNextButton();
} 

export function toggleTheme(theme, btn) { 
    if(state.selectedThemes.includes(theme)) { 
        state.selectedThemes = state.selectedThemes.filter(t => t !== theme); 
        btn.classList.remove('active'); 
    } else { 
        if(state.selectedThemes.length < 3) { 
            state.selectedThemes.push(theme); 
            btn.classList.add('active'); 
        } 
    } 
    updateBackgroundFromSelection(); 
    updateNextButton();
} 

export function handleMenuNext() { 
    // This will now trigger the AI Form Generation
    // For now, we just switch screens to simulate progress,
    // but the actual API call will be implemented in the next step.

    // Placeholder behavior:
    // document.getElementById('screen-menu').style.display = 'none';
    // document.getElementById('screen-char').style.display = 'flex';

    // We will call a function that is exposed from character.js or similar
    if (window.initCharacterCreation) {
        window.initCharacterCreation();
    } else {
        console.error("initCharacterCreation not found");
    }
}
