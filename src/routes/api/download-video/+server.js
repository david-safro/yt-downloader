import { exec } from 'youtube-dl-exec';

export async function GET({ url: { searchParams } }) {
    try {
        const videoUrl = searchParams.get('url');
        if (!videoUrl) {
            return new Response('URL parameter is missing', { status: 400 });
        }

        // First, get video info to get the title for filename
        const info = await exec(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
        });

        // Sanitize title for filename
        let sanitizedTitle = info.title
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
            .replace(/\s+/g, '_')          // Replace spaces with underscores
            .substring(0, 100);            // Limit length

        if (!sanitizedTitle) {
            sanitizedTitle = 'video';
        }

        // Start video stream using yt-dlp
        const subprocess = exec(
            videoUrl,
            {
                format: 'best[ext=mp4]/best', // Best MP4 format, or best available
                output: '-',                   // Pipe to stdout
                noCheckCertificates: true,
                noWarnings: true,
            },
            { stdio: ['ignore', 'pipe', 'ignore'] }
        );

        const videoStream = subprocess.stdout;

        return new Response(videoStream, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${sanitizedTitle}.mp4"`,
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (err) {
        console.error('Error streaming video:', err);
        return new Response('Error downloading video. Please try again.', { status: 500 });
    }
}
