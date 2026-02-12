import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Heart, Download, Share2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { likeApi, cartApi, BASE_URL } from '../utils/api';

const PinCard = ({ pin }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pin.likes || 0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0.6, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await likeApi.checkLike(pin.id);
        if (res) {
          setLiked(!!res.liked);
          if (typeof res.likes_count === 'number') {
            setLikesCount(res.likes_count);
          }
        }
      } catch {
        // Silent fail; user may not be logged in
      }
    };

    fetchLikeStatus();
  }, [pin.id]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const imageUrl =
    (pin.image_url || pin.image || '').startsWith('http')
      ? pin.image_url || pin.image
      : `${BASE_URL}${pin.image_url || pin.image || ''}`;

  const handleCardClick = (e) => {
    // Prevent button clicks from triggering navigation
    if ((e.target.closest('button'))) {
      e.preventDefault();
    }
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingLike) return;
    setLoadingLike(true);
    try {
      const res = await likeApi.toggleLike(pin.id);
      if (res) {
        setLiked(!!res.liked);
        if (typeof res.likes_count === 'number') {
          setLikesCount(res.likes_count);
        }
      }
    } catch {
      toast.error('Please login to like pins');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await cartApi.addToCart(pin.id);
      toast.success('Added to cart');
    } catch {
      toast.error('Please login to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDownload = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!imageUrl) return;
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = (pin?.title || 'creative-stock') + '.jpg';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [imageUrl, pin?.title]
  );

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/pin/${pin.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pin.title,
          text: 'Check out this creation on Creative Stock',
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } else {
        toast.info('Sharing not supported in this browser');
      }
    } catch {
      // User may cancel share; ignore
    }
  };

  return (
    <Link to={`/pin/${pin.id}`} className="block pin-card" onClick={handleCardClick}>
      <div
        ref={cardRef}
        className="waterfall-item relative group overflow-hidden rounded-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageUrl}
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
              <button
                type="button"
                onClick={handleToggleLike}
                className={`bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all ${
                  liked ? 'bg-red-500/70 hover:bg-red-500 text-white' : ''
                }`}
              >
                <Heart className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all"
              >
                <Download className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-30 transition-all"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="text-xs text-white opacity-80 flex items-center space-x-1">
              <span>₹{pin.price}</span>
              <span>•</span>
              <span>{likesCount} ❤</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PinCard;