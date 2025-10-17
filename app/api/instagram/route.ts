import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '4', 10);

  try {
    // Fetch posts from Instagram's public HTML page and parse the embedded JSON
    const username = 'the.betterbeing';
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Instagram fetch error: ${response.status}`);
    }

    const html = await response.text();

    // Extract JSON from the HTML page
    const jsonMatch = html.match(
      /<script type="application\/ld\+json">({.*?})<\/script>/
    );
    const sharedDataMatch = html.match(
      /window\._sharedData = ({.*?});<\/script>/
    );

    let posts: any[] = [];

    if (sharedDataMatch) {
      const sharedData = JSON.parse(sharedDataMatch[1]);
      const edges =
        sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
          ?.edge_owner_to_timeline_media?.edges || [];

      posts = edges.slice(0, count).map((edge: any) => ({
        id: edge.node.id,
        caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
        media_url: edge.node.display_url,
        permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
        media_type: edge.node.is_video ? 'VIDEO' : 'IMAGE',
      }));
    }

    if (posts.length === 0) {
      throw new Error('No posts found in Instagram response');
    }

    return NextResponse.json({
      posts,
      success: true,
    });
  } catch (error) {
    console.error('Instagram scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts', posts: [] },
      { status: 500 }
    );
  }
}
