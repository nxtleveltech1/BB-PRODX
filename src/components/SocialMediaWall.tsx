"use client";

import { useState, useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp?: string;
  likes?: number;
}

interface SocialMediaWallProps {
  handle: string;
  count?: number;
  showHeader?: boolean;
  gridCols?: 2 | 3 | 4 | 6;
}

export default function SocialMediaWall({
  handle,
  count = 12,
  showHeader = true,
  gridCols = 3
}: SocialMediaWallProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/instagram?count=${count}`);
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [count]);

  // Fallback posts with wellness-themed images
  const fallbackPosts = [
    {
      id: '1',
      caption: 'Discover natural wellness solutions that support your journey to better being. 🌿✨ #BetterBeing #Wellness',
      media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '2',
      caption: 'Premium wellness products designed for your daily rituals. Quality ingredients, sustainable practices. 💚',
      media_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '3',
      caption: 'Your wellness journey starts with the right choices. Choose products that nourish both body and mind. 🌸',
      media_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '4',
      caption: 'Experience the difference that premium, natural wellness products can make in your daily routine. ✨',
      media_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '5',
      caption: 'Nourish your body and mind with our carefully crafted wellness collection. 🌱',
      media_url: 'https://images.unsplash.com/photo-1596215143922-aba2cd0c2ddb?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '6',
      caption: 'Self-care starts with choosing the right wellness products for your unique journey. 💫',
      media_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '7',
      caption: 'Better Being: where quality meets wellness, and nature meets science. 🌿',
      media_url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '8',
      caption: 'Transform your wellness routine with products designed to work in harmony with your body. 🌸',
      media_url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '9',
      caption: 'From nature to nourishment - discover the Better Being difference. 💚',
      media_url: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '10',
      caption: 'Wellness made simple, natural, and effective. Your journey starts here. ✨',
      media_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '11',
      caption: 'Embrace holistic wellness with our thoughtfully curated product range. 🌱',
      media_url: 'https://images.unsplash.com/photo-1600428877887-59d403795f6f?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '12',
      caption: 'Better begins with you. Better begins here. 💫',
      media_url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&h=600&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/the.betterbeing/',
      media_type: 'IMAGE' as const,
    },
  ];

  const displayPosts = error || posts.length === 0 ? fallbackPosts.slice(0, count) : posts;

  // Extract first 8-12 words for aria-label
  const getExcerpt = (caption?: string) => {
    if (!caption) return 'View Instagram post';
    const words = caption.split(/\s+/).slice(0, 12);
    return words.join(' ') + (caption.split(/\s+/).length > 12 ? '...' : '');
  };

  // Grid class based on gridCols prop
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[gridCols];

  if (loading) {
    return (
      <section className="space-section bg-[#F9E7C9] relative">
        <div className="max-w-7xl mx-auto px-6">
          {showHeader && (
            <div className="text-center mb-12">
              <h2
                className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Follow Our Journey
              </h2>
              <div className="inline-flex items-center gap-2 text-[#BB4500] text-lg font-medium">
                <Instagram className="w-5 h-5 animate-pulse" />
                <span>@{handle}</span>
              </div>
            </div>
          )}
          <div className={`grid ${gridClasses} gap-4 mb-8`}>
            {[...Array(count)].map((_, index) => (
              <div key={index} className="aspect-square bg-[#2C2B29]/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-section bg-[#F9E7C9] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#BB4500]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#B5A642]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-luxury rounded-full mb-6">
              <div className="w-2 h-2 bg-[#BB4500] rounded-full luxury-glow"></div>
              <span className="text-[#BB4500] text-sm font-bold uppercase tracking-[0.2em]">Follow Us</span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Join Our Wellness <span className="text-luxury">Community</span>
            </h2>

            <a
              href={`https://www.instagram.com/${handle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#BB4500] hover:text-[#2C2B29] transition-colors text-lg font-medium group"
            >
              <Instagram className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>@{handle}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        )}

        {/* Instagram Posts Grid */}
        <div className={`grid ${gridClasses} gap-4 mb-12`}>
          {displayPosts.slice(0, count).map((post, index) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block aspect-square overflow-hidden rounded-lg bg-[#2C2B29]/5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              aria-label={getExcerpt(post.caption)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={post.media_url}
                  alt={getExcerpt(post.caption)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  unoptimized={post.media_url.includes('unsplash.com')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.png';
                  }}
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Caption on hover */}
                {post.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm line-clamp-3 font-light">
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Instagram icon overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                    <Instagram className="w-5 h-5 text-[#BB4500]" />
                  </div>
                </div>
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
            className="inline-flex items-center gap-3 bg-[#BB4500] hover:bg-[#2C2B29] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg hover:gap-5 hover:shadow-xl group"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            <Instagram className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>Follow @{handle}</span>
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  );
}
