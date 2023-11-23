import ytdl from 'ytdl-core';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const url = body.url;
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const videoDetails = {
            title,
            runtime: info.videoDetails.lengthSeconds,
            uploader: info.videoDetails.author.name,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
        };
        return new Response(JSON.stringify(videoDetails));
    } catch (err) {
        console.error(err);
        return new Response('Error retrieving video info', { status: 500 });
    }
}
