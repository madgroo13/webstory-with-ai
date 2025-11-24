import { state } from '../state.js';
import { GENRE_DEFINITIONS } from '../config.js';
import { processTurn } from '../api.js';
import { getIcon } from './utils.js';

let isCraftingMode = false; 
export let selectedItem = null; 
let craftSlots = [null, null]; 
let isInventoryOpen = false; 

export function setSelectedItem(item) {
    selectedItem = item;
}

export function toggleInventoryView() { 
    const invArea = document.getElementById('inventory-area'); 
    const btn = document.getElementById('btn-toggle-inv'); 
    isInventoryOpen = !isInventoryOpen; 
    if (isInventoryOpen) { 
        invArea.classList.remove('inv-collapsed'); invArea.classList.add('inv-expanded'); btn.classList.add('active'); renderInventory(); 
    } else { 
        invArea.classList.remove('inv-expanded'); invArea.classList.add('inv-collapsed'); btn.classList.remove('active'); 
    } 
} 

export function getStartingInventory(genres, themes) { 
    let items = []; 
    genres.forEach(g => { if (GENRE_DEFINITIONS[g]) items.push(...GENRE_DEFINITIONS[g].items); }); 
    const t = themes.join(" ").toLowerCase(); 
    if (t.includes('cyber') || t.includes('tech')) items.push("Datapad"); 
    if (t.includes('space') || t.includes('alien')) items.push("Scanner"); 
    if (t.includes('zombie') || t.includes('apoc')) items.push("Crowbar"); 
    if (t.includes('fantasy') || t.includes('myth')) items.push("Scroll"); 
    if (t.includes('viking') || t.includes('war')) items.push("Axe"); 
    if (t.includes('horror') || t.includes('gothic')) items.push("Flashlight"); 
    if (t.includes('slice') || t.includes('corp')) items.push("Smartphone"); 
    if (t.includes('steampunk')) items.push("Goggles"); 
    if (items.length < 3) items.push("Water", "Rations"); 
    return [...new Set(items)].slice(0, 6); 
} 

export function renderInventory() { 
    const grid = document.getElementById('inv-grid'); grid.innerHTML = ''; 
    if (state.inventory.length === 0) { grid.innerHTML = '<div class="inv-item" style="opacity:0.5; width:100%;">Tas Kosong</div>'; return; } 
    state.inventory.forEach(item => { 
        const div = document.createElement('div'); div.className = 'inv-item'; 
        if (craftSlots.includes(item)) div.classList.add('selected'); 
        div.innerHTML = `<div class="inv-icon">${getIcon(item)}</div><div>${item}</div>`; 
        div.onclick = (e) => handleInvClick(item, e); 
        grid.appendChild(div); 
    }); 
} 

function handleInvClick(item) { 
    if(isCraftingMode) { 
        if(craftSlots[0] === item) craftSlots[0] = null; else if(craftSlots[1] === item) craftSlots[1] = null; else if(!craftSlots[0]) craftSlots[0] = item; else if(!craftSlots[1]) craftSlots[1] = item; else { craftSlots[0] = item; craftSlots[1] = null; } 
        updateCraftUI(); renderInventory(); 
    } else { selectedItem = item; document.getElementById('item-actions').style.display = 'flex'; } 
} 

export function toggleCraftingMode() { 
    isCraftingMode = !isCraftingMode; document.getElementById('craft-status').textContent = isCraftingMode ? "ON" : "OFF"; 
    document.getElementById('crafting-controls').style.display = isCraftingMode ? 'flex' : 'none'; 
    document.getElementById('item-actions').style.display = 'none'; craftSlots = [null, null]; updateCraftUI(); renderInventory(); 
} 

export function updateCraftUI() { 
    document.getElementById('craft-slot-1').textContent = craftSlots[0] || "Item 1"; 
    document.getElementById('craft-slot-2').textContent = craftSlots[1] || "Item 2"; 
    document.getElementById('btn-craft').disabled = !(craftSlots[0] && craftSlots[1]); 
} 

export function handleItemAction(action) { closePopup(); processTurn(`Action: ${action} on item '${selectedItem}'.`); } 
export function executeCraft() { const i1 = craftSlots[0]; const i2 = craftSlots[1]; processTurn(`Crafting attempt: '${i1}' + '${i2}'.`); toggleCraftingMode(); } 
export function closePopup() { document.getElementById('item-actions').style.display = 'none'; selectedItem = null; }