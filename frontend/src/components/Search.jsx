import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PinCard from '../components/PinCard';
import { pinApi } from '../utils/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filteredPins, setFilteredPins] = useState([]);
  const [allPins, setAllPins] = useState([]);



  useEffect(() => {
    const fetchPins = async () => {
      try {
        const data = await pinApi.getPins();
        setAllPins(data);

        // Filter pins based on search query
        if (searchQuery) {
          const filtered = data.filter(pin =>
            pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pin.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pin.user.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredPins(filtered);
        } else {
          setFilteredPins(data);
        }
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    };

    fetchPins();
  }, [searchQuery]);

  useEffect(() => {
    // Update search query when URL params change
    const query = searchParams.get('q');
    if (query !== searchQuery) {
      setSearchQuery(query || '');
    }
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for ideas..."
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {filteredPins.length > 0 ? (
          <div className="waterfall-grid">
            {filteredPins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or browse our collections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;