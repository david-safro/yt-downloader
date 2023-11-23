import ytdl from 'ytdl-core';

export async function GET({ url: { searchParams } }) {
    try {
        const url = searchParams.get('url');
        if (!url) {
            return new Response('URL parameter is missing', {status: 400});
        }
            const info = await ytdl.getInfo(url);
        let title = info.videoDetails.title.replace(/\s+/g, '_');

        // Sanitize the title to remove non-ASCII characters
        title = title.replace(/[^\x00-\x7F]/g, "");

        // If the title becomes empty after sanitization, use a fallback
        if (!title) {
            title = 'download';
        }

        const stream = ytdl(url, { quality: 'highest', filter: 'audioandvideo' });

        return new Response(stream, {
            headers: {
                'Content-Disposition': `attachment; filename="${title}.mp4"`
            }
        });
    } catch (err) {
        console.error(err);
        return new Response('Error downloading video', { status: 500 });
    }
}
