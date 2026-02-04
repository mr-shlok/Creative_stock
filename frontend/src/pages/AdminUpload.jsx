import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Upload,
    X,
    ArrowLeft,
    Plus,
    Tag as TagIcon,
    Layout,
    ChevronDown,
    IndianRupee,
    Info,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import { uploadApi, pinApi, boardApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminUpload = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [boards, setBoards] = useState([]);
    const [showNewBoardInput, setShowNewBoardInput] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        tags: '',
        board_id: ''
    });

    useEffect(() => {
        if (user) {
            fetchBoards();
        }
    }, [user]);

    const fetchBoards = async () => {
        try {
            const data = await boardApi.getBoards(user.id);
            setBoards(data);
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleCreateBoard = async () => {
        if (!newBoardName.trim()) return;
        try {
            const board = await boardApi.createBoard({
                name: newBoardName,
                user_id: user.id
            });
            setBoards([...boards, board]);
            setFormData({ ...formData, board_id: board.id });
            setNewBoardName('');
            setShowNewBoardInput(false);
            toast.success("Board created!");
        } catch (error) {
            toast.error("Failed to create board");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select an image");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload image to Supabase Storage
            const uploadResult = await uploadApi.uploadImage(selectedFile);

            // 2. Prepare pin data
            const pinData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                image_url: uploadResult.url, // Watermarked/Optimized URL
                original_url: uploadResult.originalUrl, // Full res URL
                board_id: formData.board_id || null,
                user_id: user.id
            };

            // 3. Create pin via Backend API
            await pinApi.createPin(pinData);

            toast.success("Creation published successfully!");
            navigate('/admin');
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Publishing failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <AdminSidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                            >
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">Upload Creation</h1>
                                <p className="text-gray-500 font-medium">Create a new masterpiece for the marketplace.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Image Upload Area */}
                        <div className="lg:col-span-5">
                            <div
                                className={`sticky top-32 border-2 border-dashed rounded-3xl p-4 transition-all ${previewUrl ? 'border-red-200 bg-white shadow-sm' : 'border-gray-200 hover:border-red-400 bg-gray-50'
                                    }`}
                            >
                                {previewUrl ? (
                                    <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                        >
                                            <X size={20} className="text-red-600" />
                                        </button>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="text-white font-bold flex items-center gap-2">
                                                <ImageIcon size={20} />
                                                Click to Change
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center aspect-[3/4] p-8 text-center">
                                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <Upload className="w-10 h-10 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 mb-2">Drag and drop</h3>
                                        <p className="text-gray-500 font-medium text-sm mb-6">
                                            High-quality JPG, PNG or SVG<br />up to 10MB
                                        </p>
                                        <div className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold shadow-sm hover:border-red-600 hover:text-red-600 transition-all">
                                            Browse Files
                                        </div>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Form Details Area */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border-2 border-gray-100 focus:border-red-500 rounded-2xl outline-none shadow-sm transition-all text-lg font-bold"
                                    placeholder="Add your title"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border-2 border-gray-100 focus:border-red-500 rounded-2xl outline-none shadow-sm transition-all font-medium resize-none"
                                    placeholder="Tell everyone what your creation is about..."
                                />
                            </div>

                            {/* Price & Tags Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                        Price <IndianRupee size={14} className="text-gray-400" />
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full pl-10 pr-6 py-4 bg-white border-2 border-gray-100 focus:border-red-500 rounded-2xl outline-none shadow-sm transition-all font-bold"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                        Tags <TagIcon size={14} className="text-gray-400" />
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border-2 border-gray-100 focus:border-red-500 rounded-2xl outline-none shadow-sm transition-all font-medium"
                                        placeholder="abstract, nature, ui..."
                                    />
                                    <p className="text-[10px] text-gray-400 ml-2 font-medium">Separate tags with commas</p>
                                </div>
                            </div>

                            {/* Board Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-black text-gray-700 ml-1">
                                    Board <Layout size={14} className="text-gray-400" />
                                    <span className="text-gray-400 font-normal ml-auto flex items-center gap-1 cursor-help hover:text-gray-600">
                                        <Info size={12} />
                                        Organize your work
                                    </span>
                                </label>

                                <div className="space-y-4">
                                    {!showNewBoardInput ? (
                                        <div className="flex gap-2">
                                            <div className="relative flex-grow">
                                                <select
                                                    value={formData.board_id}
                                                    onChange={(e) => setFormData({ ...formData, board_id: e.target.value })}
                                                    className="w-full appearance-none px-6 py-4 bg-white border-2 border-gray-100 focus:border-red-500 rounded-2xl outline-none shadow-sm transition-all font-bold pr-12"
                                                >
                                                    <option value="">Choose a Board (Optional)</option>
                                                    {boards.map(board => (
                                                        <option key={board.id} value={board.id}>{board.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewBoardInput(true)}
                                                className="p-4 bg-white border-2 border-gray-100 text-red-600 rounded-2xl hover:border-red-500 transition-all flex-shrink-0 shadow-sm"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={newBoardName}
                                                onChange={(e) => setNewBoardName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCreateBoard();
                                                    }
                                                    if (e.key === 'Escape') setShowNewBoardInput(false);
                                                }}
                                                className="flex-grow px-6 py-4 bg-white border-2 border-red-500 rounded-2xl outline-none shadow-sm font-bold"
                                                placeholder="Enter board name..."
                                            />
                                            <button
                                                type="button"
                                                disabled={!newBoardName.trim()}
                                                onClick={handleCreateBoard}
                                                className="px-6 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                                            >
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewBoardInput(false)}
                                                className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isUploading || !selectedFile || !formData.title}
                                    className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-xl hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 shadow-xl shadow-red-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} />
                                            Publish My Creation
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-gray-400 text-sm mt-4 font-medium flex items-center justify-center gap-2">
                                    <Info size={14} />
                                    Your creation will be visible on the home feed immediately.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminUpload;
