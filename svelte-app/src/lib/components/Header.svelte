<script>
    import { gameState } from '$lib/store.js';

    function toggleInventory() {
        gameState.update(s => ({ ...s, isInventoryVisible: !s.isInventoryVisible }));
    }

    // Placeholders for other header functions
    function exportSave() { alert('Save not implemented yet!'); }
    function loadSave() { document.getElementById('file-upload')?.click(); }
    function confirmReset() { if (confirm('Reset game?')) { window.location.reload(); } }
</script>

<div id="header">
    <h1>AI RPG <span class="tag">COMPLETE</span></h1>
    <div class="ctrl-group">
        <button
            class="btn-small"
            class:active={$gameState.isInventoryVisible}
            on:click={toggleInventory}
        >
            <span>🎒</span> Tas
        </button>
        <button class="btn-small" on:click={exportSave}>💾 Save</button>
        <button class="btn-small" on:click={loadSave}>📂 Load</button>
        <button class="btn-small" style="color:#ff8888" on:click={confirmReset}>❌ Reset</button>
        <input type="file" id="file-upload" style="display:none" />
    </div>
</div>
