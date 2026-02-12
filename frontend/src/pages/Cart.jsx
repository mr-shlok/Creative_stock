import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { cartApi } from '../utils/api';
import { toast } from 'react-toastify';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartApi.getCartItems();
            setCartItems(data.items || []);
        } catch (error) {
            toast.error("Failed to fetch cart");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (pinId) => {
        try {
            await cartApi.removeFromCart(pinId);
            toast.success("Removed from cart");
            fetchCart(); // Refresh cart
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.pins?.price || 0);
        }, 0).toFixed(2);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-white rounded-full transition-colors"
                            >
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="text-red-600" size={32} />
                                <h1 className="text-4xl font-black text-gray-900">Shopping Cart</h1>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium ml-14">Review your selected items before checkout.</p>
                    </header>

                    {loading ? (
                        /* Loading State */
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-32 bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : cartItems.length === 0 ? (
                        /* Empty Cart */
                        <div className="py-20 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <ShoppingCart size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 font-medium mb-6">Browse our collection to find amazing creations!</p>
                            <button
                                onClick={() => navigate('/overview')}
                                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                            >
                                Explore Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.pin_id}
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex gap-6 hover:shadow-md transition-all"
                                    >
                                        {/* Image */}
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.pins?.image_url}
                                                alt={item.pins?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-black text-gray-900 mb-1">
                                                {item.pins?.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3 font-medium">
                                                {item.pins?.description}
                                            </p>
                                            <p className="text-2xl font-black text-red-600">
                                                ₹{item.pins?.price}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(item.pin_id)}
                                            className="p-3 h-fit bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"
                                            aria-label="Remove from cart"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
                                    <h3 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Items ({cartItems.length})</span>
                                            <span className="font-bold text-gray-900">₹{calculateTotal()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Tax</span>
                                            <span className="font-bold text-gray-900">₹0.00</span>
                                        </div>
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-black text-gray-900">Total</span>
                                                <span className="text-2xl font-black text-red-600">₹{calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                        onClick={() => toast.info("Checkout coming soon!")}
                                    >
                                        <CreditCard size={20} />
                                        Proceed to Checkout
                                    </button>

                                    <p className="text-xs text-gray-400 text-center mt-4 font-medium">
                                        Secure payment processing
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cart;
