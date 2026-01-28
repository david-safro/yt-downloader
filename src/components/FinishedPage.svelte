<script>
    import { createEventDispatcher } from 'svelte';

    export let videoDetails;

    const dispatch = createEventDispatcher();

    function formatRuntime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function downloadMore() {
        dispatch('downloadMore');
    }
</script>

<div class="finished-container">
    <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    </div>

    <h1>Download Complete!</h1>
    <p class="subtitle">Your video has been downloaded successfully</p>

    <div class="video-card">
        <img src={videoDetails.thumbnail} alt="Video Thumbnail" class="thumbnail" />
        <div class="video-info">
            <h3 class="title">{videoDetails.title}</h3>
            <p class="meta">
                <span class="uploader">{videoDetails.uploader}</span>
                <span class="separator">•</span>
                <span class="duration">{formatRuntime(videoDetails.runtime)}</span>
            </p>
        </div>
    </div>

    <div class="soundwave-container">
        <span class="soundwave" style="animation-delay: 0s"></span>
        <span class="soundwave" style="animation-delay: 0.1s"></span>
        <span class="soundwave" style="animation-delay: 0.2s"></span>
        <span class="soundwave" style="animation-delay: 0.3s"></span>
        <span class="soundwave" style="animation-delay: 0.4s"></span>
    </div>

    <button on:click={downloadMore} class="download-more-button">
        Download Another Video
    </button>
</div>

<style>
    .finished-container {
        text-align: center;
        max-width: 500px;
        width: 100%;
        padding: 2rem;
    }

    .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        color: #4ade80;
        animation: scaleIn 0.5s ease-out;
    }

    .success-icon svg {
        width: 100%;
        height: 100%;
    }

    @keyframes scaleIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    h1 {
        color: #fff;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #aaa;
        margin-bottom: 2rem;
    }

    .video-card {
        background-color: #333;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .thumbnail {
        width: 100%;
        height: auto;
        display: block;
    }

    .video-info {
        padding: 1rem;
        text-align: left;
    }

    .title {
        color: #fff;
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .meta {
        color: #888;
        font-size: 0.9rem;
        margin: 0;
    }

    .separator {
        margin: 0 0.5rem;
    }

    .soundwave-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        height: 40px;
        margin-bottom: 2rem;
    }

    .soundwave {
        display: inline-block;
        width: 6px;
        height: 20px;
        background: linear-gradient(to top, crimson, #ff6b6b);
        border-radius: 3px;
        animation: soundwave-animation 0.8s ease-in-out infinite;
    }

    @keyframes soundwave-animation {
        0%, 100% {
            height: 20px;
        }
        50% {
            height: 40px;
        }
    }

    .download-more-button {
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

    .download-more-button:hover {
        background-color: #b01540;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(220, 20, 60, 0.4);
    }
</style>
