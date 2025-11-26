<script>
    import { gameState } from '$lib/store.js';
    import { STAT_NAMES, STAT_DESC } from '$lib/config.js';

    let tempPoints = 10;
    let tempStats = { STR: 0, INT: 0, DEX: 0, CHA: 0 };
    let charName = "Hero";
    let charLang = "Indonesia";

    function modStat(stat, val) {
        if (val > 0 && tempPoints > 0) {
            tempStats[stat]++;
            tempPoints--;
        } else if (val < 0 && tempStats[stat] > 0) {
            tempStats[stat]--;
            tempPoints++;
        }
        // Force reactivity by reassigning the object
        tempStats = tempStats;
    }

    function startGame() {
        // Update the character stats in the store
        let finalStats = {};
        for (const stat of STAT_NAMES) {
            finalStats[stat] = 3 + tempStats[stat];
        }

        $gameState.char = {
            ...$gameState.char,
            name: charName,
            stats: finalStats
        };

        $gameState.language = charLang;

        // In a real scenario, we'd also calculate starting inventory here
        // and send the initial prompt to the AI.
        // For now, we'll just switch the screen.

        $gameState.currentScreen = 'game';
    }
</script>

<div id="screen-char" class="screen-overlay">
    <h2 class="screen-title">KARAKTER</h2>
    <div style="color:var(--warning); margin-bottom:10px;">Poin: <span id="points-val">{tempPoints}</span></div>

    <div id="stats-inputs" style="width:100%; max-width:500px;">
        {#each STAT_NAMES as stat}
            <div class="stat-row">
                <div>
                    <div style="font-weight:bold;">{stat}</div>
                    <span style="font-size:0.7em; color:#aaa;">{STAT_DESC[stat]}</span>
                </div>
                <div class="stat-controls">
                    <button on:click={() => modStat(stat, -1)}>-</button>
                    <span class="stat-val">{tempStats[stat]}</span>
                    <button on:click={() => modStat(stat, 1)}>+</button>
                </div>
            </div>
        {/each}
    </div>

    <div class="input-group" style="margin-top:20px;">
        <label for="char-name">Nama Karakter</label>
        <input type="text" id="char-name" placeholder="Masukkan nama..." bind:value={charName}>
    </div>
    <div class="input-group">
        <label for="char-lang">Bahasa Cerita</label>
        <input type="text" id="char-lang" placeholder="Indonesia / English" bind:value={charLang}>
    </div>

    <button class="big-btn" on:click={startGame}>Mulai Petualangan</button>
</div>
