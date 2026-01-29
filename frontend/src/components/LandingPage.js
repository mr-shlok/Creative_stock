import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { pinApi, BASE_URL } from '../utils/api';

// Bento placement: first 9 get editorial layout, rest flow in rows of 4
const getBentoPlacement = (index) => {
  if (index === 0) return { gridColumn: '1 / 3', gridRow: '1 / 3', size: 'hero' };
  if (index === 1) return { gridColumn: '3 / 4', gridRow: '1 / 2', size: 'small' };
  if (index === 2) return { gridColumn: '4 / 5', gridRow: '1 / 2', size: 'small' };
  if (index === 3) return { gridColumn: '3 / 4', gridRow: '2 / 3', size: 'small' };
  if (index === 4) return { gridColumn: '4 / 5', gridRow: '2 / 3', size: 'small' };
  if (index === 5) return { gridColumn: '1 / 2', gridRow: '3 / 4', size: 'small' };
  if (index === 6) return { gridColumn: '2 / 3', gridRow: '3 / 4', size: 'small' };
  if (index === 7) return { gridColumn: '3 / 4', gridRow: '3 / 4', size: 'small' };
  if (index === 8) return { gridColumn: '4 / 5', gridRow: '3 / 4', size: 'small' };
  // From index 9: fill row by row, 4 per row
  const rest = index - 9;
  const row = 4 + Math.floor(rest / 4);
  const col = (rest % 4) + 1;
  return {
    gridColumn: `${col} / ${col + 1}`,
    gridRow: `${row} / ${row + 1}`,
    size: rest % 5 === 0 ? 'medium' : 'small',
  };
};

const LandingPage = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImagesRef = useRef({});
  const heroTextRef = useRef(null);
  const dotsRef = useRef(null);

  // Fetch images from admin uploads
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        console.log('Fetching pins from API...');
        const pins = await pinApi.getPins();
        console.log('API response:', pins);
        
        // Filter for hero-worthy images (no limit – show all admin uploads)
        const heroPins = pins.filter(pin => pin.image && (pin.title?.length > 0 || pin.description?.length > 0));
        
        console.log('Filtered heroPins:', heroPins);
        setHeroImages(heroPins);
      } catch (error) {
        console.error('Error fetching hero images:', error);
      }
    };

    fetchHeroImages();
  }, []);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Initial page load animations
  useEffect(() => {
    // Hero text animation
    if (heroTextRef.current) {
      // Animate the Creative Stock logo letters with multiple creative effects
      const logoSpans = heroTextRef.current.querySelectorAll('.creative-stock-logo');
      
      // Create staggered animation for each letter
      logoSpans.forEach((span, index) => {
        // Split each word into individual characters for character-by-character animation
        const textContent = span.textContent;
        span.innerHTML = '';
        
        // Create a container for each character
        textContent.split('').forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.margin = '0 2px';
          span.appendChild(charSpan);
          
          // Apply multiple animation effects
          gsap.fromTo(charSpan,
            { 
              opacity: 0, 
              y: index === 0 ? -100 : 100, 
              scale: 0, 
              rotationX: 180,
              rotationY: index === 0 ? -180 : 180
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotationX: 0,
              rotationY: 0,
              duration: 1.2, 
              delay: 0.1 * (index * textContent.length + charIndex), 
              ease: "elastic.out(1.2, 0.6)",
              // Additional animation after the initial one
              onComplete: () => {
                // Add a subtle continuous animation
                gsap.to(charSpan, {
                  y: -5,
                  duration: 1,
                  yoyo: true,
                  repeat: -1,
                  ease: "sine.inOut",
                  delay: 0.5
                });
              }
            }
          );
          
          // Add a secondary glow effect
          gsap.fromTo(charSpan,
            { boxShadow: "0 0 0px #ff0000" },
            { 
              boxShadow: index === 0 ? "0 0 5px #666" : "0 0 5px #f00",
              duration: 1.5,
              delay: 0.1 * (index * textContent.length + charIndex) + 0.5,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut"
            }
          );
        });
      });
      
      // Add overall container animation
      gsap.fromTo(heroTextRef.current,
        { scale: 0.5, rotation: -5 },
        { scale: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      );
    }

    // Slider dots animation
    if (dotsRef.current) {
      gsap.fromTo(dotsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }

    // Staggered entrance for gallery images (clean fade-up)
    setTimeout(() => {
      heroImages.forEach((pin, index) => {
        const imgRef = heroImagesRef.current[pin.id];
        if (!imgRef) return;
        gsap.fromTo(imgRef,
          { opacity: 0, y: 28, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: index * 0.04, ease: "power3.out", overwrite: "auto" }
        );
      });
    }, 300);
  }, [heroImages]);

  const imageUrl = (pin) => pin.image?.startsWith('http') ? pin.image : `${BASE_URL}${pin.image || ''}`;

  const ImageCard = ({ pin, className = '', index = 0, placement }) => (
    <Link
      key={pin.id}
      to={`/pin/${pin.id}`}
      className={`block h-full min-h-0 home-explore-tile ${placement?.size === 'hero' ? 'home-explore-hero' : ''}`}
      style={placement ? { gridColumn: placement.gridColumn, gridRow: placement.gridRow } : undefined}
    >
      <div
        ref={el => {
          if (el) heroImagesRef.current[pin.id] = el;
          else delete heroImagesRef.current[pin.id];
        }}
        className={`relative group overflow-hidden rounded-2xl home-image-card home-explore-card h-full w-full ${className}`}
      >
        <img
          src={imageUrl(pin)}
          alt={pin.title || 'Creative inspiration'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 1. Gap from header, then Creative Stock logo only */}
        <div className="pt-8 pb-4 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
            <div ref={heroTextRef} className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 creative-stock-logo" style={{ fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif" }}>Creative</span>
                <span className="block text-red-600 creative-stock-logo" style={{ fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif" }}>Stock</span>
              </h1>
            </div>
            <div ref={dotsRef} className="flex justify-center space-x-2 mt-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex % 3 ? 'bg-red-600 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Explore gallery: bento / editorial grid – distinct from search waterfall */}
        {heroImages.length > 0 && (
          <section className="mt-10 sm:mt-12 home-explore-gallery" aria-label="Explore">
            <div className="home-explore-bento">
              {heroImages.map((pin, i) => {
                const placement = getBentoPlacement(i);
                return (
                  <ImageCard
                    key={pin.id}
                    pin={pin}
                    index={i}
                    placement={placement}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LandingPage;