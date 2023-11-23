<script>
    export let title = '';
    export let runtime = '';
    export let uploader = '';
    export let thumbnail = '';

    export let url = ''

    // Function to convert runtime in seconds to minutes and seconds
    function formatRuntime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} minute${mins !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
    }
</script>

<div class="video-details">
    <h3 class="title"><a href={url}>{title}</a></h3>
    <p><strong>Uploader:</strong> {uploader}</p>
    <p><strong>Runtime:</strong> {formatRuntime(runtime)}</p>
    <img src={thumbnail} alt="Thumbnail" style="max-width: 200px; border-radius: 10px;">
</div>

<style>
    .video-details {
        background-color: #333;
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.45);
        word-wrap: break-word;
    }
    .title {
        word-break: break-word; /* Ensures text wraps and does not overflow */
    }
    h3, h4 {
        margin: 0 0 10px 0;
    }
</style>
