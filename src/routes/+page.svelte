<!-- Main Component -->

<script>
    import Selection from '../components/Selection.svelte';
    import FinishedPage from '../components/FinishedPage.svelte';

    let url = '';
    let videoDetails = null;
    let title, runtime, uploader, thumbnail;
    let showInput = true;
    let isLoading = false;
    let isDownloading = false;

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

    async function downloadVideo() {
        isDownloading = true;
        // Simulate downloading, you should replace this with your actual download logic
        await new Promise(resolve => setTimeout(resolve, 3000));
        isDownloading = false;
    }

    function goBack() {
        window.location.href = "/";
    }
</script>


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

    {#if videoDetails && !isDownloading}
        <Selection {title} {runtime} {uploader} {thumbnail} {url} />
        <div class="button-container">
            <button on:click={goBack} class="back-button">Back</button>
            <button on:click={downloadVideo} class="download-button">
                {#if isDownloading}
                    <span class="download-animation"></span>
                {:else}
                    Download
                {/if}
            </button>
        </div>
    {/if}

    {#if isDownloading}
        <FinishedPage {videoDetails} />
    {/if}
{/if}


<style>
        @import "../../static/css/global.css";
    .button-container {
        text-align: center;
        margin-top: 20px;
    }

    .back-button, .download-button {
        padding: 10px 20px;
        margin: 0 10px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .download-button {
        background-color: crimson;
        color: white;
        border-radius: 5px;
        animation: glowing 2s linear infinite;
    }

    .back-button {
        background-color: white;
        color: black;
        border-radius: 5px;
    }

    /* Swirling RGB animation */
    @keyframes glowing {
        0% { box-shadow: 0 0 10px red, 0 0 20px blue, 0 0 30px green; }
        33% { box-shadow: 0 0 10px blue, 0 0 20px green, 0 0 30px red; }
        66% { box-shadow: 0 0 10px green, 0 0 20px red, 0 0 30px blue; }
        100% { box-shadow: 0 0 10px red, 0 0 20px blue, 0 0 30px green; }
    }
    .input-container {
        text-align: center;
        margin-top: 30px;
    }

    .input-container h1, .input-container p {
        color: #fff;
    }

    input {
        padding: 10px;
        margin-bottom: 10px;
        border: 2px solid #555;
        border-radius: 5px;
        font-size: 16px;
        color: #ddd;
        background-color: #222;
    }

    .fetch-button {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        background-color: #444;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .fetch-button:hover {
        background-color: #d05050;
    }

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

    .download-animation {
        display: inline-block;
        width: 30px;
        height: 40px;
        background-color: #3498db;
        margin-right: 5px;
        animation: soundwave-animation 0.5s infinite alternate;
    }

    @keyframes soundwave-animation {
        0% { height: 40px; }
        100% { height: 20px; }
    }
</style>

