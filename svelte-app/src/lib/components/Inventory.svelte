<script>
    import { gameState } from '$lib/store.js';
</script>

<!-- INVENTORY AREA (Collapsible) -->
<!-- Visibility will be controlled by a class binding based on isInventoryVisible store property -->
<div
    id="inventory-area"
    class:inv-collapsed={!$gameState.isInventoryVisible}
    class:inv-expanded={$gameState.isInventoryVisible}
>
    <div class="inv-header">
        <span>Tas Penyimpanan</span>
        <button class="btn-small">
            Mode Crafting:
            <span style="color:{$gameState.isCraftingMode ? 'var(--accent)' : '#666'}">
                {$gameState.isCraftingMode ? 'ON' : 'OFF'}
            </span>
        </button>
    </div>

    <div class="inv-grid">
        {#if $gameState.inventory.length === 0}
            <div class="inv-item" style="opacity:0.5; pointer-events:none;">Kosong</div>
        {:else}
            {#each $gameState.inventory as item}
                <div class="inv-item">
                    <!-- Placeholder for icon -->
                    <div class="inv-icon">📦</div>
                    {item}
                </div>
            {/each}
        {/if}
    </div>

    <!-- Crafting UI will be shown based on isCraftingMode -->
    {#if $gameState.isCraftingMode}
    <div id="crafting-controls" style="display: flex;">
        <div class="craft-slot">Pilih Item 1</div>
        <span style="color:white; font-weight:bold; font-size:1.2rem;">+</span>
        <div class="craft-slot">Pilih Item 2</div>
        <button class="craft-btn" disabled>GABUNGKAN</button>
    </div>
    {/if}

    <div style="text-align: center; margin-top: 10px;">
        <small style="color:#666; cursor:pointer;">▲ Tutup Tas ▲</small>
    </div>
</div>

<!-- Item Popup (logic to be implemented) -->
<!-- <div id="item-actions">
    ...
</div> -->
