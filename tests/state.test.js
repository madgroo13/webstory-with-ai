import { state, setState, resetState } from '../js/state.js';

describe('State Management', () => {
    beforeEach(() => {
        resetState();
    });

    test('initial state has correct defaults', () => {
        expect(state.history).toEqual([]);
        expect(state.selectedGenres).toEqual([]);
        expect(state.selectedThemes).toEqual([]);
        // Language default is 'id' but might be preserved if already set before import?
        // resetState sets it to 'id' or previous value.
        // Since we call resetState() in beforeEach, and initially it's undefined or default,
        // let's check what the module defaults to.
        // Actually, if I look at state.js, the initial value is "id".
        expect(state.language).toBe('id');
        expect(state.char).toEqual({
            name: "",
            hp: 100,
            maxHp: 100,
            stats: {}
        });
        expect(state.inventory).toEqual([]);
        expect(state.isGameOver).toBe(false);
    });

    test('setState updates the state', () => {
        const newState = {
            ...state,
            language: 'en',
            char: { ...state.char, hp: 50 }
        };
        setState(newState);
        expect(state.language).toBe('en');
        expect(state.char.hp).toBe(50);
    });

    test('resetState resets the state to defaults but preserves language', () => {
        state.language = 'en';
        state.inventory = ['Item1'];
        resetState();
        expect(state.language).toBe('en'); // Should be preserved
        expect(state.inventory).toEqual([]);
    });
});
