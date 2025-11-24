import { getStartingInventory, toggleCraftingMode, setSelectedItem, selectedItem, renderInventory, updateCraftUI } from '../js/modules/inventory.js';
import { state, resetState } from '../js/state.js';
import { GENRE_DEFINITIONS } from '../js/config.js';

// Mocking DOM elements
document.body.innerHTML = `
    <div id="inventory-area" class="inv-collapsed">
        <div id="inv-grid"></div>
        <button id="btn-toggle-inv"></button>
        <span id="craft-status"></span>
        <div id="crafting-controls">
            <div id="craft-slot-1"></div>
            <div id="craft-slot-2"></div>
            <button id="btn-craft"></button>
        </div>
        <div id="item-actions"></div>
    </div>
`;

describe('Inventory System', () => {
    beforeEach(() => {
        resetState();
        // Reset DOM state if needed
        document.getElementById('inventory-area').classList.remove('inv-expanded');
        document.getElementById('inventory-area').classList.add('inv-collapsed');
    });

    test('getStartingInventory returns correct items based on genres and themes', () => {
        const genres = ['Survival'];
        const themes = ['Zombie', 'Urban Fantasy'];

        const inventory = getStartingInventory(genres, themes);

        // Survival adds Knife
        // Zombie adds Crowbar
        // Urban Fantasy ("fantasy") adds Scroll.
        // Wait, "Urban Fantasy" contains "Fantasy" (case insensitive check in inventory.js: t.includes('fantasy'))
        // So Scroll is added.

        // Items: Knife, Crowbar, Scroll. Total 3.
        // So Water and Rations are NOT added.

        expect(inventory).toContain('Knife');
        expect(inventory).toContain('Crowbar');
        expect(inventory).toContain('Scroll');

        expect(inventory).not.toContain('Water');
        expect(inventory).not.toContain('Rations');
    });

    test('getStartingInventory caps at 6 items', () => {
        // Force many items
        const genres = ['Survival', 'Text RPG', 'Escape Room']; // Knife, Sword, Key
        const themes = ['Cyberpunk', 'Space', 'Zombie', 'Fantasy']; // Datapad, Scanner, Crowbar, Scroll

        const inventory = getStartingInventory(genres, themes);
        expect(inventory.length).toBeLessThanOrEqual(6);
    });

    test('setSelectedItem updates the selected item', () => {
        setSelectedItem('Sword');
        expect(selectedItem).toBe('Sword');
    });

    test('toggleCraftingMode toggles the UI', () => {
        const statusSpan = document.getElementById('craft-status');
        const controls = document.getElementById('crafting-controls');

        // Initial state is OFF (implicit)
        // toggleCraftingMode checks global var isCraftingMode (default false)

        toggleCraftingMode();
        expect(statusSpan.textContent).toBe('ON');
        expect(controls.style.display).toBe('flex');

        toggleCraftingMode();
        expect(statusSpan.textContent).toBe('OFF');
        expect(controls.style.display).toBe('none');
    });

    test('renderInventory renders items correctly', () => {
        state.inventory = ['Sword', 'Potion'];
        renderInventory();

        const grid = document.getElementById('inv-grid');
        expect(grid.children.length).toBe(2);
        expect(grid.innerHTML).toContain('Sword');
        expect(grid.innerHTML).toContain('Potion');
    });
});
