import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const BASE_URL = '';

const PinCard = ({ pin }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0.6, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
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
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
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