
<script>
    export let videoDetails;

    function downloadMore() {
        window.location.href = "/";
    }
</script>

<style>
    .soundwave {
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

    .finished-container {
        text-align: center;
        margin-top: 30px;
    }

    .download-more-button {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        background-color: #444;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 20px;
    }

    .download-more-button:hover {
        background-color: #d05050;
    }
</style>

<div class="finished-container">
    <h1>Video Downloaded Successfully!</h1>
    <p>Your video details:</p>
    <p>{videoDetails.title}</p>
    <p>{videoDetails.runtime}</p>
    <p>{videoDetails.uploader}</p>
    <img src={videoDetails.thumbnail} alt="Video Thumbnail" style="max-width: 100%; margin-top: 10px;" />

    <div>
        <span class="soundwave"></span>
        <span class="soundwave"></span>
        <span class="soundwave"></span>
    </div>

    <button on:click={downloadMore} class="download-more-button">Download More</button>
</div>
