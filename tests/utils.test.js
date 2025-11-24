import { getIcon } from '../js/modules/utils.js';

describe('getIcon', () => {
    test('returns correct icon for key items', () => {
        expect(getIcon('Key')).toBe('🔑');
        expect(getIcon('Rusty Key')).toBe('🔑');
        expect(getIcon('Kunci')).toBe('🔑');
    });

    test('returns correct icon for potion items', () => {
        expect(getIcon('Health Potion')).toBe('🧪');
        expect(getIcon('Obat')).toBe('🧪');
    });

    test('returns correct icon for weapon items', () => {
        expect(getIcon('Iron Sword')).toBe('🗡️');
        expect(getIcon('Knife')).toBe('🗡️');
        expect(getIcon('Axe')).toBe('🗡️');
    });

    test('returns correct icon for gun items', () => {
        expect(getIcon('Handgun')).toBe('🔫');
        expect(getIcon('Revolver')).toBe('🔫');
    });

    test('returns default icon for unknown items', () => {
        expect(getIcon('Unknown Item')).toBe('📦');
        expect(getIcon('Chair')).toBe('📦');
    });
});
