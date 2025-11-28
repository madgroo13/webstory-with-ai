import { modStat, resetTempStats, startGame } from '../js/screens/character.js';
import { state, resetState } from '../js/state.js';
import { processTurn } from '../js/api.js';

jest.mock('../js/api.js', () => ({
    processTurn: jest.fn()
}));

document.body.innerHTML = `
    <div id="points-val">10</div>
    <div id="val-STR">0</div>
    <div id="val-INT">0</div>
    <div id="val-DEX">0</div>
    <div id="val-CHA">0</div>
    <input id="char-name" value="Hero" />
    <input id="char-lang" value="Indonesia" />
    <div id="screen-char" style="display:block"></div>
    <div id="status-bar" style="display:none"></div>
    <div id="inventory-area" style="display:none"></div>
    <div id="input-area" style="display:none"></div>
    <div id="disp-str"></div>
    <div id="disp-int"></div>
    <div id="disp-dex"></div>
    <div id="disp-cha"></div>
    <div id="hp-bar"></div>
    <div id="hp-text"></div>
    <div id="inv-grid"></div>
`;

describe('Character Creation', () => {
    beforeEach(() => {
        resetState();
        resetTempStats();
        document.getElementById('points-val').textContent = '10';
        document.getElementById('val-STR').textContent = '0';
        jest.clearAllMocks();
    });

    test('modStat updates stats and points correctly', () => {
        modStat('STR', 1);
        expect(document.getElementById('points-val').textContent).toBe('9');
        expect(document.getElementById('val-STR').textContent).toBe('1');

        modStat('STR', -1);
        expect(document.getElementById('points-val').textContent).toBe('10');
        expect(document.getElementById('val-STR').textContent).toBe('0');
    });

    test('modStat does not go below 0 for stats', () => {
        modStat('STR', -1);
        expect(document.getElementById('val-STR').textContent).toBe('0');
        expect(document.getElementById('points-val').textContent).toBe('10');
    });

    test('modStat does not exceed available points', () => {
        // use up all points
        for(let i=0; i<10; i++) modStat('STR', 1);
        expect(document.getElementById('points-val').textContent).toBe('0');

        modStat('STR', 1);
        expect(document.getElementById('points-val').textContent).toBe('0');
        expect(document.getElementById('val-STR').textContent).toBe('10');
    });

    test('startGame initializes character and triggers processTurn', () => {
        state.selectedGenres = ['Survival'];
        state.selectedThemes = ['Zombie'];

        modStat('STR', 1);
        modStat('STR', 1); // +2 STR

        expect(document.getElementById('val-STR').textContent).toBe('2');

        startGame();

        expect(state.char.name).toBe('Hero');
        expect(state.char.stats.STR).toBe(5); // 3 (base) + 2 (mod)
        expect(state.char.stats.INT).toBe(3); // default

        expect(document.getElementById('screen-char').style.display).toBe('none');
        expect(document.getElementById('status-bar').style.display).toBe('flex');

        expect(processTurn).toHaveBeenCalled();
    });
});
