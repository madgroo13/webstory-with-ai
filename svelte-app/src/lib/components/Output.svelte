<script>
    import { gameState } from '$lib/store.js';
    import { tick } from 'svelte';

    let outputElement;

    // Automatically scroll to the bottom when history changes
    $: if ($gameState.history && outputElement) {
        // Use tick to wait for the DOM to be updated
        tick().then(() => {
            outputElement.scrollTop = outputElement.scrollHeight;
        });
    }
</script>

<div id="output" bind:this={outputElement}>
    {#each $gameState.history as entry}
        {#if entry.role === 'user'}
            <div class="log-entry user-msg">{@html entry.text}</div>
        {:else if entry.role === 'model'}
            <div class="log-entry">{@html entry.text}</div>
        {:else if entry.role === 'system'}
            <div class="log-entry system-msg">{@html entry.text}</div>
        {/if}
    {/each}
</div>
