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
        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                videoDetails = await response.json();
                ({ title, runtime, uploader, thumbnail } = videoDetails);
                showInput = false;
            } else {
                alert('Failed to fetch video information. Please check the URL and try again.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while fetching video information.');
        } finally {
            isLoading = false;
        }
    }

    function goBack() {
        window.location.href = "/";
    }

    function downloadVideo() {
        // Initiates download using the GET method of the download-video endpoint
        window.location.href = `/api/download-video?url=${encodeURIComponent(url)}`;
    }
</script>

{#if isLoading}
    <div class="loading-circle"></div>
{:else}
    {#if showInput}
        <div class="input-container">
            <h1>Welcome to YouTube Downloader</h1>
            <p>
                Finally, a website to download YouTube videos without any ads, viruses, or other malware.
                Enter the URL of the YouTube video you wish to download.
            </p>
            <input type="text" bind:value={url} placeholder="Enter YouTube URL" on:keypress={handleKeyPress}>
            <button on:click={fetchVideoInfo} class="fetch-button">Get Video Info</button>
            <p>
                Please consider <a href="https://paypal.me/davidsafro">donating</a> to me as I am broke.
            </p>
            <p>
                Also, here's the
                <a href="https://github.com/david-safro/yt-downloader" style="color:cadetblue">source code</a>
                to the website.
            </p>
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

<style>
    @import "../../static/css/global.css";
    @import "../../static/css/main.css";
</style>
