"use client";

import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface SocialMediaWallProps {
  handle: string;
  count?: number;
}

export default function SocialMediaWall({ handle, count = 4 }: SocialMediaWallProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Try to fetch Instagram posts
    // In production, this would call an API route that handles Instagram Basic Display API
    // For now, we'll use fallback placeholders
    const fetchPosts = async () => {
      try {
        // const response = await fetch(`/api/instagram?count=${count}`);
        // const data = await response.json();
        // setPosts(data.posts || []);
        
        // Fallback to placeholder data
        setError(true);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [count]);

  // Placeholder posts for when API is not available
  const placeholderPosts = [
    {
      id: '1',
      caption: 'Wellness begins with small, intentional steps every day.',
      media_url: '/Platform%20Graphics/About%20-%20Hero%20Banner.png',
      permalink: `https://www.instagram.com/${handle}/`,
      media_type: 'IMAGE' as const,
    },
    {
      id: '2',
      caption: 'Natural ingredients, powerful results.',
      media_url: '/Platform%20Graphics/Agent.png',
      permalink: `https://www.instagram.com/${handle}/`,
      media_type: 'IMAGE' as const,
    },
    {
      id: '3',
      caption: 'Join our community on the journey to better being.',
      media_url: '/Platform%20Graphics/outlet%20hero%20banner.png',
      permalink: `https://www.instagram.com/${handle}/`,
      media_type: 'IMAGE' as const,
    },
    {
      id: '4',
      caption: 'Premium wellness products you can trust.',
      media_url: '/Platform%20Graphics/Contact%20Us%20banner.png',
      permalink: `https://www.instagram.com/${handle}/`,
      media_type: 'IMAGE' as const,
    },
  ];

  const displayPosts = error || posts.length === 0 ? placeholderPosts : posts;

  // Extract first 8-12 words for aria-label
  const getExcerpt = (caption?: string) => {
    if (!caption) return 'View Instagram post';
    const words = caption.split(/\s+/).slice(0, 12);
    return words.join(' ') + (caption.split(/\s+/).length > 12 ? '...' : '');
  };

  return (
    <section className="space-section bg-[#F9E7C9] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Social Media Wall
          </h2>
          <a
            href={`https://www.instagram.com/${handle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#BB4500] hover:text-[#2C2B29] transition-colors text-lg font-medium"
          >
            <Instagram className="w-5 h-5" />
            <span>@{handle}</span>
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayPosts.slice(0, count).map((post, index) => (
            <a
              key={post.id || index}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getExcerpt(post.caption)}
              className="group relative aspect-square overflow-hidden bg-[#2C2B29]/5 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#BB4500] focus:ring-offset-2"
            >
              {/* Placeholder background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#BB4500]/10 to-[#B5A642]/10" />
              
              {/* Instagram icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 z-10">
                <Instagram className="w-12 h-12 text-white" />
              </div>

              {/* Image (if available) */}
              {post.media_url && (
                <img
                  src={post.media_url}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}

              {/* Caption preview */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <p className="text-white text-sm line-clamp-2">
                  {post.caption || 'View on Instagram'}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center">
          <a
            href={`https://www.instagram.com/${handle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#BB4500] hover:bg-[#2C2B29] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            <Instagram className="w-5 h-5" />
            <span>Follow us now</span>
          </a>
        </div>
      </div>
    </section>
  );
}
