import { exec } from 'youtube-dl-exec';

export async function POST({ request }) {
    try {
        const { url } = await request.json();
        if (!url) {
            return new Response('URL parameter is missing', { status: 400 });
        }

        // Fetch video metadata
        const info = await exec(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
        });

        const videoDetails = {
            title: info.title,
            runtime: info.duration,
            uploader: info.uploader,
            thumbnail: info.thumbnail,
        };

        return new Response(JSON.stringify(videoDetails), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error fetching video info:', err);
        return new Response('Error fetching video info', { status: 500 });
    }
}

export async function GET({ url: { searchParams } }) {
    try {
        const videoUrl = searchParams.get('url');
        if (!videoUrl) {
            return new Response('URL parameter is missing', { status: 400 });
        }

        // Start video stream using yt-dlp
        const subprocess = exec(
            videoUrl,
            {
                format: 'best', // Best video and audio combined
                output: '-',    // Pipe the output to stdout
            },
            { stdio: ['ignore', 'pipe', 'ignore'] }
        );

        const videoStream = subprocess.stdout;

        // Generate a safe filename
        let sanitizedTitle = videoUrl.split('=').pop() || 'download';
        sanitizedTitle = sanitizedTitle.replace(/[^\w\-]/g, '_') || 'download';

        return new Response(videoStream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp4"`,
            },
        });
    } catch (err) {
        console.error('Error streaming video:', err);
        return new Response('Error downloading video', { status: 500 });
    }
}
