<!-- NewLoading.svelte -->
<script>
    export let isLoading = false;
</script>

{#if isLoading}
    <div class="loading-container">
        <div class="loader"></div>
    </div>
{/if}

<style>
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
    }

    .loader {
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff; /* White color on the top */
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
            border-width: 5px;
        }
        50% {
            transform: rotate(180deg);
            border-width: 10px;
        }
        100% {
            transform: rotate(360deg);
            border-width: 5px;
        }
    }
</style>
