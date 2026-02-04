import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PinCard from '../components/PinCard';
import { pinApi } from '../utils/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const data = await pinApi.getPins();
        setPins(data);
      } catch (error) {
        toast.error("Failed to fetch pins");
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Header />
      <Sidebar />

      <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Control</h1>
                <p className="text-gray-500 font-medium">Manage the marketplace and upload new creations.</p>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
              {pins.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400 text-xl font-medium">No pins found. Start by uploading one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;