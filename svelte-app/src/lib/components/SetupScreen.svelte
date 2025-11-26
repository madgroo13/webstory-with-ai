<script>
    import { gameState } from '$lib/store.js';
    import { GENRE_DEFINITIONS, WORLD_THEMES } from '$lib/config.js';

    let menuStep = 1; // 1 for Genre, 2 for Theme

    function toggleGenre(key) {
        const selected = $gameState.selectedGenres;
        if (selected.includes(key)) {
            $gameState.selectedGenres = selected.filter(g => g !== key);
        } else {
            if (selected.length < 3) {
                $gameState.selectedGenres = [...selected, key];
            }
        }
    }

    function toggleTheme(theme) {
        const selected = $gameState.selectedThemes;
        if (selected.includes(theme)) {
            $gameState.selectedThemes = selected.filter(t => t !== theme);
        } else {
            if (selected.length < 3) {
                $gameState.selectedThemes = [...selected, theme];
            }
        }
    }

    function handleMenuNext() {
        if (menuStep === 1) {
            menuStep = 2;
        } else if (menuStep === 2) {
            $gameState.currentScreen = 'character';
        }
    }

    $: isNextDisabled = (menuStep === 1 && $gameState.selectedGenres.length === 0) || (menuStep === 2 && $gameState.selectedThemes.length === 0);
</script>

<div id="screen-menu" class="screen-overlay">
    <h2 class="screen-title">SETUP DUNIA</h2>

    {#if menuStep === 1}
    <div id="step-genre" style="width:100%; display:flex; flex-direction:column; align-items:center;">
        <div class="section-header">1. PILIH GAYA BERMAIN (MAX 3)</div>
        <div class="mechanics-grid">
            {#each Object.entries(GENRE_DEFINITIONS) as [key, def]}
                <button
                    class="toggle-btn"
                    class:active={$gameState.selectedGenres.includes(key)}
                    on:click={() => toggleGenre(key)}
                >
                    <strong>{key}</strong>
                    <small>{def.desc}</small>
                </button>
            {/each}
        </div>
    </div>
    {/if}

    {#if menuStep === 2}
    <div id="step-theme" style="width:100%; display:flex; flex-direction:column; align-items:center;">
        <div class="section-header">2. PILIH TEMA DUNIA (MAX 3)</div>
        <div class="theme-grid">
            {#each WORLD_THEMES as theme}
                <button
                    class="toggle-btn"
                    class:active={$gameState.selectedThemes.includes(theme)}
                    on:click={() => toggleTheme(theme)}
                >
                    {theme}
                </button>
            {/each}
        </div>
    </div>
    {/if}

    <button class="big-btn" disabled={isNextDisabled} on:click={handleMenuNext}>
        {#if menuStep === 1}
            PILIH TEMA ->
        {:else}
            BUAT KARAKTER ->
        {/if}
    </button>
</div>
