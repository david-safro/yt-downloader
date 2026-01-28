<script>
    export let title = '';
    export let runtime = '';
    export let uploader = '';
    export let thumbnail = '';
    export let url = '';

    function formatRuntime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
</script>

<div class="video-card">
    <div class="thumbnail-container">
        <img src={thumbnail} alt="Video Thumbnail" class="thumbnail" />
        <span class="duration-badge">{formatRuntime(runtime)}</span>
    </div>
    <div class="video-info">
        <a href={url} target="_blank" rel="noopener noreferrer" class="title">
            {title}
        </a>
        <p class="uploader">
            <svg class="channel-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {uploader}
        </p>
    </div>
</div>

<style>
    .video-card {
        background-color: #333;
        border-radius: 12px;
        overflow: hidden;
        max-width: 500px;
        margin: 0 auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .thumbnail-container {
        position: relative;
        width: 100%;
    }

    .thumbnail {
        width: 100%;
        height: auto;
        display: block;
    }

    .duration-badge {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .video-info {
        padding: 1.25rem;
    }

    .title {
        display: block;
        color: #fff;
        font-size: 1.1rem;
        font-weight: 500;
        text-decoration: none;
        margin-bottom: 0.75rem;
        line-height: 1.4;
        transition: color 0.3s ease;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .title:hover {
        color: crimson;
    }

    .uploader {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #888;
        font-size: 0.95rem;
        margin: 0;
    }

    .channel-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
    }
</style>
