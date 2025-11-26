<script>
    import { gameState } from '$lib/store.js';
    import { processTurn } from '$lib/game.js';

    let userInput = '';

    function submit() {
        if (userInput.trim() && !$gameState.isLoading) {
            processTurn(userInput);
            userInput = '';
        }
    }

    function handleChoice(option) {
        if (!$gameState.isLoading) {
            processTurn(option);
        }
    }

    // Placeholder for dice roll logic
    function rollDice() {
        if (!$gameState.isLoading) {
            alert('Dice rolling not implemented yet!');
            // In the future, this will calculate the result and call processTurn
        }
    }
</script>

<!-- Input Area -->
<div id="input-area">
    {#if $gameState.gameMode === 'text'}
        <div id="input-row">
            <input
                type="text"
                placeholder="Tulis aksi..."
                autocomplete="off"
                bind:value={userInput}
                on:keypress={(e) => e.key === 'Enter' && submit()}
                disabled={$gameState.isLoading}
            >
            <button class="btn-action" on:click={submit} disabled={$gameState.isLoading}>Go</button>
        </div>
    {:else if $gameState.gameMode === 'choice'}
        <div id="choice-container" style="display: flex; flex-direction: column; gap: 8px;">
            {#each $gameState.gameOptions || [] as option}
                <button class="choice-btn" on:click={() => handleChoice(option)} disabled={$gameState.isLoading}>
                    {option}
                </button>
            {/each}
        </div>
    {:else if $gameState.gameMode === 'dice'}
        <div id="dice-container" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div style="font-size:0.9rem; color:var(--text-muted)">
                SKILL CHECK: <span style="color:var(--warning)">{$gameState.diceCheck?.stat || '???'} (DC {$gameState.diceCheck?.dc || '?'})</span>
            </div>
            <button class="dice-box" on:click={rollDice}>D20</button>
            <div style="font-size:0.8rem; color:#aaa">Ketuk dadu</div>
        </div>
    {/if}
</div>
