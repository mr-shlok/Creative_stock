import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { pinApi, BASE_URL } from '../utils/api';

const PURCHASED_PINS_KEY = 'creativeStockPurchasedPins';

const getPurchasedPins = () => {
  try {
    const raw = localStorage.getItem(PURCHASED_PINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setPurchasedPins = (ids) => {
  localStorage.setItem(PURCHASED_PINS_KEY, JSON.stringify(ids));
};

const PinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);



  useEffect(() => {
    setPurchased(getPurchasedPins().includes(id));
  }, [id]);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const data = await pinApi.getPin(id);
        if (data) {
          setPin(data);
          setLoading(false);
          gsap.fromTo(".modal-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 });
        } else {
          // If pin not found, redirect to home
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching pin:', error);
        // If pin not found, redirect to home
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    };
    
    fetchPin();
  }, [id, navigate]);

  const closeModal = () => {
    gsap.to(".modal-overlay", {
      opacity: 0,
      duration: 0.3,
      onComplete: () => navigate(-1)
    });
  };

  const handleBuyNow = () => {
    const ids = getPurchasedPins();
    if (!ids.includes(id)) {
      setPurchasedPins([...ids, id]);
      setPurchased(true);
    }
  };

  const displayImageUrl = pin && (purchased && pin.imageOriginal
    ? (pin.imageOriginal.startsWith('http') ? pin.imageOriginal : `${BASE_URL}${pin.imageOriginal}`)
    : (pin.image?.startsWith('http') ? pin.image : `${BASE_URL}${pin.image || ''}`));

  const handleDownload = useCallback(() => {
    if (!displayImageUrl) return;
    const link = document.createElement('a');
    link.href = displayImageUrl;
    link.download = (pin?.title || 'creative-stock') + '.jpg';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [displayImageUrl, pin?.title]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Pin not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-content max-w-4xl w-full mx-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <img 
              src={displayImageUrl} 
              alt={pin.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
          
          <div className="lg:w-1/3 bg-white p-6 overflow-y-auto max-h-[70vh]">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{pin.title}</h1>
              <div className="text-xl font-bold text-red-600 mb-2">₹{pin.price}</div>
              <p className="text-gray-600 text-sm">{pin.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="font-medium text-gray-700">{(pin.user || 'U').charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-900">{pin.user || 'Unknown'}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{pin.category}</span>
              </div>
              
              <div className="flex space-x-3 mb-4">
                <button className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{pin.likes}</span>
                </button>
                
                <button className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{pin.saves}</span>
                </button>
                
                <button className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>{pin.shares}</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(pin.tags || []).map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Save to board</h3>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800">
                <option>My Inspiration Board</option>
                <option>Favorites</option>
                <option>Travel Ideas</option>
                <option>Food & Recipes</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                disabled={purchased}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  purchased
                    ? 'bg-gray-200 text-gray-600 cursor-default'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                }`}
              >
                {purchased ? 'Purchased – watermark removed' : 'Buy now – remove watermark'}
              </button>
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl font-semibold border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all"
              >
                Download image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;