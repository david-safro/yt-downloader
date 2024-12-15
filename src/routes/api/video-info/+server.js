import ytdl from '@distube/ytdl-core';

export async function POST({ request }) {
    try {
        // Parse the JSON body from the request
        const body = await request.json();
        if (!body.url) {
            return new Response(
                JSON.stringify({ error: 'URL is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Retrieve video information using ytdl from @distube/ytdl-core
        const info = await ytdl.getBasicInfo(body.url);
        const videoDetails = {
            title: info.videoDetails.title,
            runtime: info.videoDetails.lengthSeconds,
            uploader: info.videoDetails.author.name,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url
        };

        // Return a JSON response with the video details
        return new Response(JSON.stringify(videoDetails), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error retrieving video info:', err.message);

        // Send a proper JSON response for errors
        return new Response(
            JSON.stringify({ error: 'Error retrieving video info', details: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
