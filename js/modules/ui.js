import { state } from '../state.js';
import { STAT_NAMES } from '../config.js';

export function updateBackgroundFromSelection() { 
    const allKeywords = [...state.selectedGenres, ...state.selectedThemes].join(" "); 
    setAtmosphere(allKeywords); 
} 

export function setAtmosphere(type) { 
    const bg = document.getElementById('dynamic-bg'); 
    bg.className = '';  
    const t = type ? type.toLowerCase() : 'neutral'; 
    if (['forest', 'jungle', 'swamp', 'nature', 'high fantasy'].some(k => t.includes(k))) bg.classList.add('bg-forest'); 
    else if (['cyberpunk', 'city', 'future', 'neon', 'tech', 'sci-fi'].some(k => t.includes(k))) bg.classList.add('bg-cyberpunk'); 
    else if (['horror', 'dark', 'haunted', 'scary', 'night', 'gothic', 'zombie'].some(k => t.includes(k))) bg.classList.add('bg-horror'); 
    else if (['combat', 'battle', 'boss', 'fight', 'danger', 'war'].some(k => t.includes(k))) bg.classList.add('bg-combat'); 
    else if (['dungeon', 'cave', 'ruins', 'underground', 'stone', 'dark fantasy'].some(k => t.includes(k))) bg.classList.add('bg-dungeon'); 
    else if (['mystery', 'noir', 'spy'].some(k => t.includes(k))) bg.classList.add('bg-mystery'); 
    else if (['god', 'myth', 'divine'].some(k => t.includes(k))) bg.classList.add('bg-divine'); 
    else bg.classList.add('bg-neutral'); 
} 

export function printLog(html, cls) { 
    const div = document.createElement('div'); div.className = cls; div.innerHTML = html; 
    const out = document.getElementById('output'); out.appendChild(div); out.scrollTop = out.scrollHeight; 
} 

export function updateStatusUI() { 
    STAT_NAMES.forEach(s => document.getElementById(`disp-${s.toLowerCase()}`).textContent = state.char.stats[s]); 
    const pct = (state.char.hp / state.char.maxHp) * 100; 
    document.getElementById('hp-bar').style.width = `${pct}%`; 
    document.getElementById('hp-text').textContent = `${state.char.hp}/${state.char.maxHp}`; 
    document.getElementById('hp-bar').style.background = pct < 30 ? 'var(--danger)' : pct < 60 ? 'var(--warning)' : 'var(--accent)'; 
} 
