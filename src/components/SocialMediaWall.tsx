"use client";

import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import Image from 'next/image';

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
      media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/p/DEq8yFGINfp/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '2',
      caption: 'Premium wellness products designed for your daily rituals. Quality ingredients, sustainable practices. 💚',
      media_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/p/DEeGFCYIbh7/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '3',
      caption: 'Your wellness journey starts with the right choices. Choose products that nourish both body and mind. 🌸',
      media_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/p/DDzbQamoJK5/',
      media_type: 'IMAGE' as const,
    },
    {
      id: '4',
      caption: 'Experience the difference that premium, natural wellness products can make in your daily routine. ✨',
      media_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
      permalink: 'https://www.instagram.com/p/DDxJ0F3IjY5/',
      media_type: 'IMAGE' as const,
    },
  ];

  const displayPosts = error || posts.length === 0 ? fallbackPosts : posts;

  // Extract first 8-12 words for aria-label
  const getExcerpt = (caption?: string) => {
    if (!caption) return 'View Instagram post';
    const words = caption.split(/\s+/).slice(0, 12);
    return words.join(' ') + (caption.split(/\s+/).length > 12 ? '...' : '');
  };

  if (loading) {
    return (
      <section className="space-section bg-[#F9E7C9] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-4xl lg:text-5xl font-light text-[#2C2B29] leading-tight mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Social Media Wall
            </h2>
            <div className="inline-flex items-center gap-2 text-[#BB4500] text-lg font-medium">
              <Instagram className="w-5 h-5 animate-pulse" />
              <span>@{handle}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(count)].map((_, index) => (
              <div key={index} className="aspect-square bg-[#2C2B29]/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayPosts.slice(0, count).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block aspect-square overflow-hidden rounded-lg bg-[#2C2B29]/5 hover:shadow-lg transition-all duration-300"
              aria-label={getExcerpt(post.caption)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={post.media_url}
                  alt={getExcerpt(post.caption)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Overlay for better hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Instagram icon overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Instagram className="w-4 h-4 text-[#BB4500]" />
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
            className="inline-flex items-center gap-3 bg-[#BB4500] hover:bg-[#2C2B29] text-white px-8 py-4 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg hover:gap-4"
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
