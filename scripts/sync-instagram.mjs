#!/usr/bin/env node

/**
 * Instagram Post Sync Script
 *
 * Fetches posts from @the.betterbeing Instagram profile and caches them in the database.
 * Run this script periodically (e.g., via cron) to keep the social media wall fresh.
 *
 * Usage:
 *   node scripts/sync-instagram.mjs
 */

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config();

const INSTAGRAM_USERNAME = 'the.betterbeing';
const MAX_POSTS = 50; // Fetch up to 50 recent posts

async function fetchInstagramPosts() {
  console.log(`[Instagram Sync] Fetching posts from @${INSTAGRAM_USERNAME}...`);

  try {
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
      },
    });

    if (!response.ok) {
      throw new Error(`Instagram HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const posts = parseInstagramHTML(html);

    console.log(`[Instagram Sync] Extracted ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('[Instagram Sync] Error fetching posts:', error.message);
    throw error;
  }
}

function parseInstagramHTML(html) {
  const posts = [];

  // Try window._sharedData method
  const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});<\/script>/);
  if (sharedDataMatch) {
    try {
      const sharedData = JSON.parse(sharedDataMatch[1]);
      const edges =
        sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
          ?.edge_owner_to_timeline_media?.edges || [];

      for (const edge of edges.slice(0, MAX_POSTS)) {
        posts.push({
          instagram_id: edge.node.id,
          shortcode: edge.node.shortcode,
          caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          media_url: edge.node.display_url,
          media_type: edge.node.is_video ? 'VIDEO' : edge.node.__typename === 'GraphSidecar' ? 'CAROUSEL_ALBUM' : 'IMAGE',
          permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
          likes: edge.node.edge_liked_by?.count || 0,
          comments: edge.node.edge_media_to_comment?.count || 0,
          posted_at: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
        });
      }
    } catch (err) {
      console.warn('[Instagram Sync] _sharedData parsing failed:', err.message);
    }
  }

  return posts;
}

async function syncToDatabase(posts) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(databaseUrl);

  console.log(`[Instagram Sync] Syncing ${posts.length} posts to database...`);

  let inserted = 0;
  let updated = 0;

  for (const post of posts) {
    try {
      // Check if post already exists
      const existing = await sql`
        SELECT id, likes, comments
        FROM instagram_posts
        WHERE instagram_id = ${post.instagram_id}
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Update existing post
        await sql`
          UPDATE instagram_posts
          SET
            caption = ${post.caption},
            media_url = ${post.media_url},
            likes = ${post.likes},
            comments = ${post.comments},
            last_synced_at = NOW(),
            updated_at = NOW()
          WHERE instagram_id = ${post.instagram_id}
        `;
        updated++;
      } else {
        // Insert new post
        await sql`
          INSERT INTO instagram_posts (
            instagram_id,
            shortcode,
            caption,
            media_url,
            media_type,
            permalink,
            likes,
            comments,
            posted_at,
            last_synced_at,
            is_active
          ) VALUES (
            ${post.instagram_id},
            ${post.shortcode},
            ${post.caption},
            ${post.media_url},
            ${post.media_type},
            ${post.permalink},
            ${post.likes},
            ${post.comments},
            ${post.posted_at},
            NOW(),
            TRUE
          )
        `;
        inserted++;
      }
    } catch (error) {
      console.error(`[Instagram Sync] Error processing post ${post.shortcode}:`, error.message);
    }
  }

  console.log(`[Instagram Sync] Complete: ${inserted} inserted, ${updated} updated`);
}

// Main execution
(async () => {
  try {
    console.log('[Instagram Sync] Starting sync process...');
    const posts = await fetchInstagramPosts();

    if (posts.length === 0) {
      console.warn('[Instagram Sync] No posts found. Exiting.');
      process.exit(1);
    }

    await syncToDatabase(posts);
    console.log('[Instagram Sync] ✅ Sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[Instagram Sync] ❌ Sync failed:', error.message);
    process.exit(1);
  }
})();
