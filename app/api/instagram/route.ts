import { NextResponse } from 'next/server';

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp?: string;
  likes?: number;
}

const INSTAGRAM_USERNAME = 'the.betterbeing';
const CACHE_DURATION = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '12', 10);

  try {
    // Fetch posts from Instagram's public HTML page
    const response = await fetch(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
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
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: CACHE_DURATION },
    });

    if (!response.ok) {
      // Return empty array instead of failing
      console.warn('[Instagram API] Instagram fetch failed:', response.status, response.statusText);
      return NextResponse.json({
        posts: [],
        success: true,
        source: 'fallback',
        message: 'Unable to fetch Instagram posts at this time',
        cached_at: new Date().toISOString(),
      });
    }

    const html = await response.text();
    const posts = await parseInstagramHTML(html, count);

    // Return empty array gracefully if no posts found
    if (posts.length === 0) {
      console.warn('[Instagram API] No posts extracted from Instagram response');
      return NextResponse.json({
        posts: [],
        success: true,
        source: 'instagram',
        message: 'No posts available',
        cached_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      posts,
      success: true,
      source: 'instagram',
      cached_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Instagram API] Fetch error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    // Return 200 with empty array instead of 500 error to prevent page crashes
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram posts',
      posts: [],
      success: true,
      source: 'fallback',
      message: 'Instagram feed temporarily unavailable',
      cached_at: new Date().toISOString(),
    });
  }
}

async function parseInstagramHTML(html: string, count: number): Promise<InstagramPost[]> {
  const posts: InstagramPost[] = [];

  // Strategy 1: Try window._sharedData (legacy method)
  const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});<\/script>/);
  if (sharedDataMatch) {
    try {
      const sharedData = JSON.parse(sharedDataMatch[1]);
      const edges =
        sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
          ?.edge_owner_to_timeline_media?.edges || [];

      for (const edge of edges.slice(0, count)) {
        posts.push({
          id: edge.node.id,
          caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          media_url: edge.node.display_url,
          permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          media_type: edge.node.is_video ? 'VIDEO' : 'IMAGE',
          timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
          likes: edge.node.edge_liked_by?.count,
        });
      }

      if (posts.length > 0) {
        console.log(`[Instagram Parser] Extracted ${posts.length} posts via _sharedData`);
        return posts;
      }
    } catch (err) {
      console.warn('[Instagram Parser] _sharedData parsing failed:', err);
    }
  }

  // Strategy 2: Try application/ld+json schema
  const ldJsonMatches = html.matchAll(/<script type="application\/ld\+json">(.+?)<\/script>/gs);
  for (const match of ldJsonMatches) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type'] === 'ProfilePage' && data.mainEntity?.interactionStatistic) {
        // This usually contains profile metadata, not posts
        continue;
      }
    } catch (err) {
      console.warn('[Instagram Parser] ld+json parsing failed:', err);
    }
  }

  // Strategy 3: Try extracting from script tags containing "xdt_api__v1__media"
  const apiDataMatch = html.match(/"xdt_api__v1__media__shortcode__web_info".*?"data":\s*({.+?})\s*}/s);
  if (apiDataMatch) {
    try {
      const mediaData = JSON.parse(apiDataMatch[1]);
      // Parse media data if available
    } catch (err) {
      console.warn('[Instagram Parser] API data parsing failed:', err);
    }
  }

  return posts;
}
