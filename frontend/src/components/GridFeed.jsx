import React, { useState, useEffect, useCallback } from 'react';
import PinCard from './PinCard';
import gsap from 'gsap';
import { pinApi } from '../utils/api';

const GridFeed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchPins = async () => {
      try {
        const data = await pinApi.getPins();
        setPins(data);
        setLoading(false);

        // Trigger GSAP animations for all pins with a slight delay to ensure DOM is ready
        setTimeout(() => {
          gsap.from(".waterfall-item", {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all" // Clean up inline styles after animation
          });
        }, 100);
      } catch (error) {
        console.error('Error fetching pins:', error);
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  // For infinite scroll, we would need pagination from the backend
  // For now, we'll just show a message if we want to implement it later
  const loadMorePins = useCallback(() => {
    // In a real implementation, we would fetch more pins from the API
    // with pagination parameters
    console.log('Load more pins would be implemented with backend pagination');
  }, []);

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 && !loading
      ) {
        loadMorePins();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePins, loading]);

  if (loading && pins.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-8">
      <div className="waterfall-grid px-4">
        {pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}
    </div>
  );
};

export default GridFeed;