<script>
    import Selection from '../components/Selection.svelte';
    import FinishedPage from '../components/FinishedPage.svelte';

    // App state: 'input' | 'loading' | 'selection' | 'downloading' | 'finished'
    let appState = 'input';
    let url = '';
    let videoDetails = null;
    let errorMessage = '';

    // Download progress tracking
    let downloadProgress = 0;
    let downloadedBytes = 0;
    let totalBytes = 0;
    let downloadStatus = 'Preparing download...';

    function handleKeyPress(event) {
        if (event.key === 'Enter' && url.trim()) {
            fetchVideoInfo();
        }
    }

    function isValidYouTubeUrl(url) {
        const patterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
            /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
            /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/
        ];
        return patterns.some(pattern => pattern.test(url));
    }

    async function fetchVideoInfo() {
        if (!url.trim()) {
            errorMessage = 'Please enter a YouTube URL';
            return;
        }

        if (!isValidYouTubeUrl(url)) {
            errorMessage = 'Please enter a valid YouTube URL';
            return;
        }

        errorMessage = '';
        appState = 'loading';

        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                videoDetails = await response.json();
                appState = 'selection';
            } else {
                const error = await response.json().catch(() => ({}));
                errorMessage = error.error || 'Failed to fetch video information. Please check the URL and try again.';
                appState = 'input';
            }
        } catch (err) {
            console.error(err);
            errorMessage = 'An error occurred while fetching video information. Please try again.';
            appState = 'input';
        }
    }

    function goBack() {
        appState = 'input';
        videoDetails = null;
        errorMessage = '';
    }

    function resetAll() {
        appState = 'input';
        url = '';
        videoDetails = null;
        errorMessage = '';
        downloadProgress = 0;
        downloadedBytes = 0;
        totalBytes = 0;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async function downloadVideo() {
        appState = 'downloading';
        downloadProgress = 0;
        downloadedBytes = 0;
        totalBytes = 0;
        downloadStatus = 'Starting download...';

        try {
            const response = await fetch(`/api/download-video?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const contentLength = response.headers.get('Content-Length');
            totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'video.mp4';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match) filename = match[1];
            }

            const reader = response.body.getReader();
            const chunks = [];

            downloadStatus = 'Downloading...';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                chunks.push(value);
                downloadedBytes += value.length;

                if (totalBytes > 0) {
                    downloadProgress = Math.round((downloadedBytes / totalBytes) * 100);
                    downloadStatus = `Downloading: ${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)}`;
                } else {
                    // Unknown total size - show bytes downloaded
                    downloadStatus = `Downloading: ${formatBytes(downloadedBytes)}`;
                    // Simulate progress for unknown size
                    downloadProgress = Math.min(95, downloadProgress + 0.5);
                }
            }

            downloadStatus = 'Processing...';
            downloadProgress = 100;

            // Combine chunks and create blob
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const downloadUrl = URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            downloadStatus = 'Download complete!';
            appState = 'finished';

        } catch (err) {
            console.error('Download error:', err);
            errorMessage = 'Failed to download video. Please try again.';
            appState = 'selection';
        }
    }
</script>

<div class="container">
    {#if appState === 'input'}
        <div class="input-container">
            <h1>YouTube Downloader</h1>
            <p class="subtitle">
                Download YouTube videos without ads, viruses, or malware.
            </p>

            <div class="input-wrapper">
                <input
                    type="text"
                    bind:value={url}
                    placeholder="Paste YouTube URL here..."
                    on:keypress={handleKeyPress}
                    class:error={errorMessage}
                >
                <button on:click={fetchVideoInfo} class="fetch-button">
                    Get Video
                </button>
            </div>

            {#if errorMessage}
                <p class="error-message">{errorMessage}</p>
            {/if}

            <div class="info-links">
                <p>
                    Consider <a href="https://paypal.me/davidsafro">donating</a> to support this project.
                </p>
                <p>
                    View the <a href="https://github.com/david-safro/yt-downloader" class="source-link">source code</a> on GitHub.
                </p>
            </div>
        </div>

    {:else if appState === 'loading'}
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Fetching video information...</p>
        </div>

    {:else if appState === 'selection'}
        <Selection
            title={videoDetails.title}
            runtime={videoDetails.runtime}
            uploader={videoDetails.uploader}
            thumbnail={videoDetails.thumbnail}
            {url}
        />
        <div class="button-container">
            <button on:click={goBack} class="back-button">Back</button>
            <button on:click={downloadVideo} class="download-button">Download</button>
        </div>

    {:else if appState === 'downloading'}
        <div class="download-container">
            <h2>Downloading Video</h2>
            <p class="video-title">{videoDetails.title}</p>

            <div class="progress-wrapper">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {downloadProgress}%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-status">{downloadStatus}</span>
                    <span class="progress-percent">{downloadProgress}%</span>
                </div>
            </div>

            <div class="download-animation">
                <div class="pulse-ring"></div>
                <div class="download-icon">⬇</div>
            </div>
        </div>

    {:else if appState === 'finished'}
        <FinishedPage {videoDetails} on:downloadMore={resetAll} />
    {/if}
</div>

<style>
    .container {
        min-height: calc(100vh - 4rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    /* Input State Styles */
    .input-container {
        text-align: center;
        max-width: 600px;
        width: 100%;
    }

    .input-container h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: #fff;
    }

    .subtitle {
        color: #aaa;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    input {
        width: 100%;
        max-width: 450px;
        padding: 14px 18px;
        border: 2px solid #555;
        border-radius: 8px;
        font-size: 16px;
        color: #fff;
        background-color: #333;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    input:focus {
        outline: none;
        border-color: crimson;
        box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.2);
    }

    input.error {
        border-color: #ff6b6b;
    }

    input::placeholder {
        color: #888;
    }

    .fetch-button {
        padding: 14px 32px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        background-color: crimson;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .fetch-button:hover {
        background-color: #b01540;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(220, 20, 60, 0.4);
    }

    .error-message {
        color: #ff6b6b;
        margin-top: 1rem;
        font-size: 0.9rem;
    }

    .info-links {
        margin-top: 2rem;
        color: #888;
    }

    .info-links p {
        margin: 0.5rem 0;
    }

    .info-links a {
        color: crimson;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .info-links a:hover {
        color: #ff6b6b;
        text-decoration: underline;
    }

    .source-link {
        color: cadetblue !important;
    }

    .source-link:hover {
        color: #7ec8c8 !important;
    }

    /* Loading State Styles */
    .loading-container {
        text-align: center;
    }

    .loading-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid #333;
        border-top: 4px solid crimson;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text {
        color: #aaa;
        font-size: 1.1rem;
    }

    /* Button Container */
    .button-container {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .back-button, .download-button {
        padding: 12px 28px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .back-button {
        background-color: #444;
        color: white;
    }

    .back-button:hover {
        background-color: #555;
    }

    .download-button {
        background-color: crimson;
        color: white;
        animation: glowing 2s linear infinite;
    }

    .download-button:hover {
        background-color: #b01540;
        transform: translateY(-2px);
    }

    @keyframes glowing {
        0% { box-shadow: 0 0 5px crimson, 0 0 10px crimson, 0 0 15px crimson; }
        50% { box-shadow: 0 0 10px crimson, 0 0 20px crimson, 0 0 30px crimson; }
        100% { box-shadow: 0 0 5px crimson, 0 0 10px crimson, 0 0 15px crimson; }
    }

    /* Download Progress Styles */
    .download-container {
        text-align: center;
        max-width: 500px;
        width: 100%;
    }

    .download-container h2 {
        color: #fff;
        margin-bottom: 0.5rem;
    }

    .video-title {
        color: #aaa;
        font-size: 0.95rem;
        margin-bottom: 2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .progress-wrapper {
        margin-bottom: 2rem;
    }

    .progress-bar {
        width: 100%;
        height: 12px;
        background-color: #333;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 0.75rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, crimson, #ff6b6b);
        border-radius: 6px;
        transition: width 0.3s ease;
    }

    .progress-info {
        display: flex;
        justify-content: space-between;
        color: #aaa;
        font-size: 0.9rem;
    }

    .progress-percent {
        color: crimson;
        font-weight: 500;
    }

    .download-animation {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto;
    }

    .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid crimson;
        border-radius: 50%;
        animation: pulse 1.5s ease-out infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    .download-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        color: crimson;
        animation: bounce 1s ease-in-out infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translate(-50%, -50%); }
        50% { transform: translate(-50%, -40%); }
    }
</style>
