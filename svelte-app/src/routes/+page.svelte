<script>
    import { gameState } from '$lib/store.js';
    import Header from '$lib/components/Header.svelte';
    import StatusBar from '$lib/components/StatusBar.svelte';
    import Output from '$lib/components/Output.svelte';
    import Inventory from '$lib/components/Inventory.svelte';
    import InputArea from '$lib/components/InputArea.svelte';
    import SetupScreen from '$lib/components/SetupScreen.svelte';
    import CharacterScreen from '$lib/components/CharacterScreen.svelte';

</script>

<div id="dynamic-bg" class="bg-neutral"></div>

<div id="game-container">
    {#if $gameState.currentScreen === 'game'}
        <Header />
        <StatusBar />
        <Output />
        <Inventory />
        <InputArea />
    {:else if $gameState.currentScreen === 'setup'}
        <SetupScreen />
    {:else if $gameState.currentScreen === 'character'}
        <CharacterScreen />
    {/if}
</div>
