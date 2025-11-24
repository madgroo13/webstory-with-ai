import { state } from '../state.js';
import { TRANSLATIONS, getEffectiveLanguage } from './localization.js';

export function applyTranslations() {
    const uiLang = getEffectiveLanguage(state.language);
    const text = TRANSLATIONS[uiLang];
    if (!text) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (text[key]) {
            // Handle inputs with placeholders
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = text[key];
            } else {
                // If the element has children (like icons), we might need a safer way
                // But for now, most buttons are text or span+text.
                // Let's assume textContent is safe or specific structure
                if (el.children.length === 0) {
                     el.textContent = text[key];
                } else {
                    // If it has children (like the inventory button <span>🎒</span> Tas)
                    // We need to find the text node.
                    // Simplified: just update the last text node?
                     // Or better: use a specific span for text in HTML
                     // Let's assume we will wrap text in spans in HTML for complex buttons
                     // Or just replace innerHTML if we include the icon in translation?
                     // The Translation file includes icons for some buttons.
                     // So innerHTML is risky but works if we control it.
                     // Safest: check if there is a 'data-i18n-target'
                     el.innerHTML = text[key];
                }
            }
        }
    });
}

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
    return div;
} 

export function updateStatusUI() { 
    // HP Bar
    if (state.char.maxHp > 0) {
        const pct = (state.char.hp / state.char.maxHp) * 100;
        document.getElementById('hp-bar').style.width = `${pct}%`;
        document.getElementById('hp-text').textContent = `${state.char.hp}/${state.char.maxHp}`;
        document.getElementById('hp-bar').style.background = pct < 30 ? 'var(--danger)' : pct < 60 ? 'var(--warning)' : 'var(--accent)';
    }

    // Dynamic Stats
    const container = document.getElementById('dynamic-stats');
    if (!container) return;

    container.innerHTML = '';

    if (state.char.stats) {
        Object.keys(state.char.stats).forEach(key => {
            const val = state.char.stats[key];
            const div = document.createElement('div');
            div.className = 'stat-item';
            div.innerHTML = `${key}<span style="color:var(--accent);">${val}</span>`;
            container.appendChild(div);
        });
    }
} 
