import { toggleGenre, toggleTheme, handleMenuNext, resetSetupState } from '../js/screens/setup.js';
import { state, resetState } from '../js/state.js';

// Mock DOM
document.body.innerHTML = `
    <div id="genre-list"></div>
    <div id="theme-list"></div>
    <div id="stats-inputs"></div>
    <div id="step-genre"></div>
    <div id="step-theme"></div>
    <div id="screen-menu"></div>
    <div id="screen-char"></div>
    <button id="btn-next"></button>
    <div id="dynamic-bg"></div>
`;

describe('Setup Screen', () => {
    beforeEach(() => {
        resetState();
        resetSetupState();
        document.getElementById('genre-list').innerHTML = '';
        document.getElementById('theme-list').innerHTML = '';
        document.getElementById('step-genre').style.display = 'block';
        document.getElementById('step-theme').style.display = 'none';
        document.getElementById('screen-menu').style.display = 'block';
        document.getElementById('screen-char').style.display = 'none';
    });

    test('toggleGenre limits selection to 3', () => {
        const btn1 = document.createElement('div');
        const btn2 = document.createElement('div');
        const btn3 = document.createElement('div');
        const btn4 = document.createElement('div');

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

    test('handleMenuNext transitions from Genre to Theme to Character', () => {
        // Step 1: Genre -> Theme
        handleMenuNext();
        expect(document.getElementById('step-genre').style.display).toBe('none');
        expect(document.getElementById('step-theme').style.display).toBe('flex');

        // Step 2: Theme -> Character
        handleMenuNext();
        expect(document.getElementById('screen-menu').style.display).toBe('none');
        expect(document.getElementById('screen-char').style.display).toBe('flex');
    });
});
