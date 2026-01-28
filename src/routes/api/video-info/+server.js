import { exec } from 'youtube-dl-exec';

export async function POST({ request }) {
    try {
        const body = await request.json();

        if (!body.url) {
            return new Response(
                JSON.stringify({ error: 'URL is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate YouTube URL
        const youtubePatterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
            /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
            /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/
        ];

        const isValidUrl = youtubePatterns.some(pattern => pattern.test(body.url));
        if (!isValidUrl) {
            return new Response(
                JSON.stringify({ error: 'Invalid YouTube URL' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch video metadata using yt-dlp
        const info = await exec(body.url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
        });

        const videoDetails = {
            title: info.title,
            runtime: info.duration,
            uploader: info.uploader || info.channel || 'Unknown',
            thumbnail: info.thumbnail,
        };

        return new Response(JSON.stringify(videoDetails), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error retrieving video info:', err.message);

        return new Response(
            JSON.stringify({ error: 'Failed to fetch video information. Please check the URL and try again.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
