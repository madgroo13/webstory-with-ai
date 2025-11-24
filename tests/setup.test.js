import { toggleGenre, toggleTheme, handleMenuNext, resetSetupState } from '../js/screens/setup.js';
import { state, resetState } from '../js/state.js';

// Mock DOM
document.body.innerHTML = `
    <div id="genre-list"></div>
    <div id="theme-list"></div>
    <div id="screen-menu"></div>
    <div id="screen-char"></div>
    <button id="btn-next"></button>
    <div id="dynamic-bg"></div>
`;

// Mock global functions called by handleMenuNext
window.initCharacterCreation = jest.fn();

describe('Setup Screen', () => {
    beforeEach(() => {
        resetState();
        resetSetupState();
        document.getElementById('genre-list').innerHTML = '';
        document.getElementById('theme-list').innerHTML = '';
        document.getElementById('screen-menu').style.display = 'block';
        document.getElementById('screen-char').style.display = 'none';
        window.initCharacterCreation.mockClear();
    });

    test('toggleGenre limits selection to 3', () => {
        const btn1 = document.createElement('div');
        const btn2 = document.createElement('div');
        const btn3 = document.createElement('div');
        const btn4 = document.createElement('div');
        btn1.dataset.key = 'G1';
        btn2.dataset.key = 'G2';
        btn3.dataset.key = 'G3';
        btn4.dataset.key = 'G4';

        // Note: In real code, we use GENRE_DEFINITIONS to check conflicts,
        // but here we are testing the basic toggle logic which pushes to state array.
        // We might need to mock updateBackgroundFromSelection or GENRE_DEFINITIONS if the function relies on them heavily.
        // The real toggleGenre calls updateBackgroundFromSelection.

        toggleGenre('G1', btn1);
        toggleGenre('G2', btn2);
        toggleGenre('G3', btn3);

        expect(state.selectedGenres).toHaveLength(3);
        expect(btn1.classList.contains('active')).toBe(true);

        toggleGenre('G4', btn4);
        expect(state.selectedGenres).toHaveLength(3);
        expect(state.selectedGenres).not.toContain('G4');
        expect(btn4.classList.contains('active')).toBe(false);

        // Untoggle
        toggleGenre('G1', btn1);
        expect(state.selectedGenres).toHaveLength(2);
        expect(btn1.classList.contains('active')).toBe(false);
    });

    test('toggleTheme limits selection to 3', () => {
        const btn = document.createElement('div');

        toggleTheme('T1', btn);
        toggleTheme('T2', btn);
        toggleTheme('T3', btn);

        expect(state.selectedThemes).toHaveLength(3);

        toggleTheme('T4', btn);
        expect(state.selectedThemes).toHaveLength(3);
        expect(state.selectedThemes).not.toContain('T4');
    });

    test('handleMenuNext triggers initCharacterCreation', () => {
        // Setup state to allow next (though implementation of handleMenuNext currently bypasses check or we mocked it)
        state.selectedGenres = ['G1'];
        state.selectedThemes = ['T1'];

        handleMenuNext();

        expect(window.initCharacterCreation).toHaveBeenCalled();
    });
});
