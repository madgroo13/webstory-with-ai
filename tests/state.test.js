import { state, setState, resetState } from '../js/state.js';

describe('State Management', () => {
    beforeEach(() => {
        resetState();
    });

    test('initial state has correct defaults', () => {
        expect(state.history).toEqual([]);
        expect(state.selectedGenres).toEqual([]);
        expect(state.selectedThemes).toEqual([]);
        expect(state.language).toBe('Indonesia');
        expect(state.char).toEqual({
            name: "",
            hp: 100,
            maxHp: 100,
            stats: {STR:3, INT:3, DEX:3, CHA:3}
        });
        expect(state.inventory).toEqual([]);
        expect(state.isGameOver).toBe(false);
    });

    test('setState updates the state', () => {
        const newState = {
            ...state,
            language: 'English',
            char: { ...state.char, hp: 50 }
        };
        setState(newState);
        expect(state.language).toBe('English');
        expect(state.char.hp).toBe(50);
    });

    test('resetState resets the state to defaults', () => {
        state.language = 'English';
        state.inventory = ['Item1'];
        resetState();
        expect(state.language).toBe('Indonesia');
        expect(state.inventory).toEqual([]);
    });
});
