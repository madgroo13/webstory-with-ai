import { startGame, initCharacterCreation } from '../js/screens/character.js';
import { state, resetState } from '../js/state.js';
import { processTurn, generateCharacterForm } from '../js/api.js';

// Mock API and DOM
jest.mock('../js/api.js', () => ({
    processTurn: jest.fn(),
    generateCharacterForm: jest.fn()
}));

document.body.innerHTML = `
    <div id="screen-menu" style="display:flex"></div>
    <div id="screen-char" style="display:none">
        <div id="ai-char-form"></div>
        <input id="char-name" value="Hero" />
        <button onclick="startGame()" style="display:block"></button>
    </div>
    <div id="status-bar" style="display:none"></div>
    <div id="inventory-area" style="display:none"></div>
    <div id="input-area" style="display:none"></div>
    <div id="hp-bar"></div>
    <div id="hp-text"></div>
    <div id="dynamic-stats"></div>
    <div id="current-setup"></div>
`;

describe('Character Creation', () => {
    beforeEach(() => {
        resetState();
        jest.clearAllMocks();
        document.getElementById('ai-char-form').innerHTML = '';
    });

    test('initCharacterCreation calls generateCharacterForm and renders inputs', async () => {
        const mockFormData = {
            fields: [
                { key: 'role', label: 'Role', type: 'text', default: 'Warrior' },
                { key: 'age', label: 'Age', type: 'number', default: '25' }
            ]
        };
        generateCharacterForm.mockResolvedValue(mockFormData);

        await initCharacterCreation();

        expect(document.getElementById('screen-menu').style.display).toBe('none');
        expect(document.getElementById('screen-char').style.display).toBe('flex');

        // Check if fields were rendered
        expect(document.getElementById('field-role')).toBeTruthy();
        expect(document.getElementById('field-age')).toBeTruthy();
        expect(document.getElementById('field-role').value).toBe('Warrior');
    });

    test('startGame collects form data and triggers processTurn', async () => {
        // Simulate a rendered form first
        const mockFormData = {
            fields: [
                { key: 'role', label: 'Class', type: 'text' }
            ]
        };
        generateCharacterForm.mockResolvedValue(mockFormData);
        await initCharacterCreation();

        // User inputs data
        const input = document.getElementById('field-role');
        if(input) input.value = 'Mage';

        // Start Game
        startGame();

        expect(state.char.name).toBe('Hero');
        expect(document.getElementById('screen-char').style.display).toBe('none');
        expect(document.getElementById('status-bar').style.display).toBe('flex');

        // Check if processTurn was called with the form data in the prompt
        expect(processTurn).toHaveBeenCalled();
        const calledPrompt = processTurn.mock.calls[0][0];
        expect(calledPrompt).toContain('Class');
        expect(calledPrompt).toContain('Mage');
    });
});
