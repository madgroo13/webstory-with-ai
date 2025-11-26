// Note: The 'model' can be configured here, but the apiKey is now handled securely.
export const model = "gemini-1.5-flash-preview-0514";

// 1. GAMEPLAY STYLES
export const GENRE_DEFINITIONS = {
    'Dynamic IF': { desc: "Narasi murni, bebas.", items: ["Notebook"] },
    'CYOA Infinite': { desc: "Pilihan A/B/C/D.", items: ["Coin"] },
    'Lore Explorer': { desc: "Arkeologi & Sejarah.", items: ["Magnifier"] },
    'Text RPG': { desc: "HP, Combat & Stats.", items: ["Sword"] },
    'Class Sim': { desc: "Simulasi profesi.", items: ["ID Card"] },
    'Isekai': { desc: "Dunia baru & skill unik.", items: ["Amulet"] },
    'Detective': { desc: "Investigasi & Bukti.", items: ["Badge"] },
    'Escape Room': { desc: "Puzzle logika.", items: ["Key"] },
    'Social Eng': { desc: "Manipulasi sosial.", items: ["USB"] },
    'God Game': { desc: "Kontrol dunia makro.", items: ["Tablet"] },
    'Dating Sim': { desc: "Romansa & Hubungan.", items: ["Gift"] },
    'Survival': { desc: "Bertahan hidup.", items: ["Knife"] },
    'Alchemy': { desc: "Gabungkan konsep.", items: ["Mortar"] },
    'Debate': { desc: "Adu argumen.", items: ["Suit"] },
    'Horror 2nd': { desc: "Sudut pandang 'Anda'.", items: ["Candle"] }
};

// 2. WORLD THEMES
export const WORLD_THEMES = [
    "Cyberpunk", "Deep Space", "Apocalypse", "Time Travel", "Hard Sci-Fi", "Alien Invasion",
    "High Fantasy", "Dark Fantasy", "Urban Fantasy", "Mythology", "Wuxia", "Steampunk",
    "Cosmic Horror", "Psychological", "Zombie", "Gothic", "Spy Thriller",
    "World War", "Viking", "Wild West", "Noir", "Naval",
    "Slice of Life", "Corporate", "Philosophy", "Surreal", "Journalism"
];

export const STAT_NAMES = ['STR', 'INT', 'DEX', 'CHA'];
export const STAT_DESC = {'STR': 'Fisik', 'INT': 'Akal', 'DEX': 'Kecepatan', 'CHA': 'Sosial'};
