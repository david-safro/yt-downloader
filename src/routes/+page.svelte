<script>
    import Selection from '../components/Selection.svelte';

    let url = '';
    let videoDetails = null;
    let title, runtime, uploader, thumbnail;
    let showInput = true;
    let isLoading = false;

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            fetchVideoInfo();
        }
    }

    async function fetchVideoInfo() {
        isLoading = true;
        const response = await fetch('/api/video-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        videoDetails = await response.json();
        isLoading = false;

        if (videoDetails) {
            ({ title, runtime, uploader, thumbnail } = videoDetails);
            showInput = false;
        }
    }

    function goBack() {
        window.location.href = "/";
    }

    function downloadVideo() {
        window.location.href = `/api/download-video?url=${encodeURIComponent(url)}`;
    }
</script>

<style>
    /* Existing styles */

    .loading-circle {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
        display: block;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

{#if isLoading}
    <div class="loading-circle"></div>
{:else}
    {#if showInput}
        <div class="input-container">
            <h1>Welcome to Youtube Downloader</h1>
            <p>Finally, a website to download youtube videos without any ads, viruses, or other malware. Enter the URL of the YouTube video you wish to download.</p>
            <input type="text" bind:value={url} placeholder="Enter YouTube URL" on:keypress={handleKeyPress}>
            <button on:click={fetchVideoInfo} class="fetch-button">Get Video Info</button>
            <p>please considering <a href="https://paypal.me/davidsafro">donating</a> to me as I am broke</p>
            <p>Also, here's the <a href="https://github.com/Glitchez-1984/yt-downloader" style="color:cadetblue">source code</a> to the website.</p>
        </div>
    {/if}

    {#if videoDetails}
        <Selection {title} {runtime} {uploader} {thumbnail} {url} />
        <div class="button-container">
            <button on:click={goBack} class="back-button">Back</button>
            <button on:click={downloadVideo} class="download-button">Download</button>
        </div>
    {/if}
{/if}
