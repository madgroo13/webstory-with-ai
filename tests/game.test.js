import { rollDice, submitAction, setMode } from '../js/screens/game.js';
import { state, resetState } from '../js/state.js';
import { processTurn } from '../js/api.js';

jest.mock('../js/api.js', () => ({
    processTurn: jest.fn()
}));

// Mock DOM
document.body.innerHTML = `
    <div id="input-row"></div>
    <div id="choice-container"></div>
    <div id="dice-container"></div>
    <div id="user-input" value=""></div>
    <div id="check-reason"></div>
    <div id="dice-box"></div>
    <div id="output"></div>
    <div id="status-bar">
        <div id="disp-str">0</div>
        <div id="disp-int">0</div>
        <div id="disp-dex">0</div>
        <div id="disp-cha">0</div>
        <div id="hp-bar"></div>
        <div id="hp-text"></div>
    </div>
`;
// Input element needs value property
Object.defineProperty(document.getElementById('user-input'), 'value', {
    value: '',
    writable: true
});

describe('Game Logic', () => {
    beforeEach(() => {
        resetState();
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('submitAction calls processTurn with user input', () => {
        document.getElementById('user-input').value = 'Hit goblin';
        submitAction();
        expect(processTurn).toHaveBeenCalledWith('Hit goblin');
    });

    test('submitAction does nothing if input is empty', () => {
        document.getElementById('user-input').value = '  ';
        submitAction();
        expect(processTurn).not.toHaveBeenCalled();
    });

    test('setMode updates UI for text mode', () => {
        setMode('text');
        expect(document.getElementById('input-row').style.display).toBe('flex');
        expect(document.getElementById('choice-container').style.display).toBe('none');
        expect(document.getElementById('dice-container').style.display).toBe('none');
    });

    test('setMode updates UI for choice mode', () => {
        setMode('choice', { options: ['Yes', 'No'] });
        expect(document.getElementById('input-row').style.display).toBe('none');
        const choiceContainer = document.getElementById('choice-container');
        expect(choiceContainer.style.display).toBe('flex');
        expect(choiceContainer.children.length).toBe(2);
        expect(choiceContainer.children[0].textContent).toBe('Yes');
    });

    test('setMode updates UI for dice mode', () => {
        setMode('dice', { check: { stat: 'STR', dc: 10 } });
        expect(document.getElementById('dice-container').style.display).toBe('flex');
        expect(document.getElementById('check-reason').textContent).toContain('STR');
    });

    test('rollDice performs a roll and calls processTurn', () => {
        // Setup dice mode
        setMode('dice', { check: { stat: 'STR', dc: 10 } });
        state.char.stats.STR = 5;

        // Mock Math.random to return a predictable value
        // Math.random returns 0-1. Floor(x * 20) + 1.
        // If random is 0.5 -> 10 + 1 = 11.
        jest.spyOn(Math, 'random').mockReturnValue(0.5);

        rollDice();

        // Check animation class
        expect(document.getElementById('dice-box').classList.contains('dice-anim')).toBe(true);

        // Fast forward timers
        jest.runAllTimers();

        expect(document.getElementById('dice-box').classList.contains('dice-anim')).toBe(false);
        // Roll 11 + Bonus 5 = 16. Success.
        expect(document.getElementById('dice-box').textContent).toBe('11');

        // processTurn should be called with result
        expect(processTurn).toHaveBeenCalledWith(expect.stringContaining('Rolled 16 (Success)'), true);

        Math.random.mockRestore();
    });
});
