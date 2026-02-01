import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Heart, Download, Share2 } from 'lucide-react';

const BASE_URL = '';

const PinCard = ({ pin }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0.6, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }, cardRef); // Scope to cardRef

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <Link to={`/pin/${pin.id}`} className="block pin-card">
      <div
        ref={cardRef}
        className="waterfall-item relative group overflow-hidden rounded-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={pin.image?.startsWith('http') ? pin.image : `${BASE_URL}${pin.image || ''}`}
          alt={pin.title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        {/* Pinterest-style light white fade from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/5 to-transparent pointer-events-none" />
        <div className="pin-actions">
          <h3 className="text-white font-medium text-sm">{pin.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all">
                <Heart className="w-4 h-4 text-white" />
              </button>

              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all">
                <Download className="w-4 h-4 text-white" />
              </button>

              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all">
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="text-xs text-white opacity-80">
              ₹{pin.price} • {pin.user}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PinCard;