<script>
    import { gameState } from '$lib/store.js';
    import { STAT_NAMES } from '$lib/config.js';

    $: hpPercentage = ($gameState.char.maxHp > 0) ? ($gameState.char.hp / $gameState.char.maxHp) * 100 : 0;
</script>

<div id="status-bar">
    <div class="hp-container">
        <span style="color:var(--danger); font-weight:bold;">HP</span>
        <div class="hp-bar-bg">
            <div
                class="hp-bar-fill"
                style="width: {hpPercentage}%"
            ></div>
        </div>
        <span id="hp-text" style="font-size:0.8rem;">{$gameState.char.hp}/{$gameState.char.maxHp}</span>
    </div>
    <div class="stats-display">
        {#each STAT_NAMES as stat}
        <div class="stat-item">
            {stat}<span>{$gameState.char.stats[stat] || 0}</span>
        </div>
        {/each}
    </div>
</div>
