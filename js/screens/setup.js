import { state } from '../state.js';
import { GENRE_DEFINITIONS, WORLD_THEMES, STAT_NAMES, STAT_DESC } from '../config.js';
import { updateBackgroundFromSelection } from '../modules/ui.js';
import { modStat } from './character.js';

let menuStep = 1;

export function resetSetupState() {
    menuStep = 1;
}

export function init() { 
    const gGrid = document.getElementById('genre-list'); 
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
    WORLD_THEMES.forEach(theme => { 
        const btn = document.createElement('div'); 
        btn.className = 'toggle-btn'; 
        btn.textContent = theme; 
        btn.onclick = () => toggleTheme(theme, btn); 
        tGrid.appendChild(btn); 
    }); 

    const sList = document.getElementById('stats-inputs'); 
    STAT_NAMES.forEach(stat => { 
        const row = document.createElement('div'); 
        row.className = 'stat-row'; 
        row.innerHTML = ` 
            <div><div style="font-weight:bold;">${stat}</div><span style="font-size:0.7em; color:#aaa;">${STAT_DESC[stat]}</span></div> 
            <div class="stat-controls"><button data-stat="${stat}" data-val="-1">-</button><span class="stat-val" id="val-${stat}">0</span><button data-stat="${stat}" data-val="1">+</button></div> 
        `; 
        sList.appendChild(row); 
    }); 

    // Add listeners for stats manually since we can't use onclick with module exports easily in innerHTML string above
    sList.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            modStat(btn.dataset.stat, parseInt(btn.dataset.val));
        });
    });

    updateGenreButtonStates();
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
    document.getElementById('btn-next').disabled = state.selectedGenres.length === 0; 
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
    document.getElementById('btn-next').disabled = state.selectedThemes.length === 0; 
} 

export function handleMenuNext() { 
    const btn = document.getElementById('btn-next'); 
    if (menuStep === 1) { 
        menuStep = 2; 
        document.getElementById('step-genre').style.display = 'none'; 
        document.getElementById('step-theme').style.display = 'flex'; 
        btn.disabled = true;  
        btn.textContent = "BUAT KARAKTER ->"; 
        state.selectedThemes = []; 
        document.querySelectorAll('#theme-list .toggle-btn').forEach(b => b.classList.remove('active')); 
    } else if (menuStep === 2) { 
        document.getElementById('screen-menu').style.display = 'none'; 
        document.getElementById('screen-char').style.display = 'flex'; 
    } 
}