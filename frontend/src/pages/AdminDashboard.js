import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pinApi, categoryApi, uploadApi } from '../utils/api';

// Categories shown in the "Category" select when admin adds image to pin (always available)
const DEFAULT_PIN_CATEGORIES = [
  'Geometric', 'Abstract', 'Floral', 'Stripes', 'Polka Dots',
  'Chevron', 'Mandala', 'Paisley', 'Damask', 'Brocade',
  'Jacobean', 'Art Deco', 'Art Nouveau', 'Bohemian', 'Botanical',
  'Celestial', 'Animal Prints', 'Aztec', 'Boho Chic', 'Celtic',
  'Chintz', 'Ditsy', 'Ethnic', 'Flora', 'Folk Art'
];

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('pins'); // pins, categories, users
  const [pins, setPins] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_PIN_CATEGORIES);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    imageOriginal: '',
    user: '',
    category: '',
    description: '',
    price: '',
    currency: 'INR',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdminLoggedIn');
    if (!adminStatus) {
      navigate('/admin/login');
    } else {
      setIsLoggedIn(true);
    }
    
    // Load data from API
    const loadData = async () => {
      try {
        const [pinsData, categoriesData] = await Promise.all([
          pinApi.getPins(),
          categoryApi.getCategories()
        ]);
        
        // Process categories: use API list if non-empty, else keep default pin categories
        const categoryNames = (categoriesData || []).map(cat =>
          typeof cat === 'string' ? cat : (cat && cat.name)
        ).filter(Boolean);
        
        setPins(pinsData);
        setCategories(categoryNames.length > 0 ? categoryNames : DEFAULT_PIN_CATEGORIES);
      } catch (error) {
        console.error('Error loading data:', error);
        setCategories(DEFAULT_PIN_CATEGORIES);
      }
    };
    
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const result = await uploadApi.uploadImage(selectedFile);
      setFormData({
        ...formData,
        image: result.url,
        imageOriginal: result.originalUrl || ''
      });
      return result.url;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // If there's a selected file that hasn't been uploaded yet, upload it first
      let imageUrl = formData.image;
      if (selectedFile && !imageUrl) {
        imageUrl = await handleUpload();
        if (!imageUrl) return; // Upload failed
      }
      
      // Process tags: convert comma-separated string to array
      const processedFormData = {
        ...formData,
        image: imageUrl,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        price: Number(formData.price)
      };
      
      if (editingId) {
        // Update existing pin
        await pinApi.updatePin(editingId, processedFormData);
        setPins(pins.map(pin => 
          pin.id === editingId ? { ...processedFormData, id: editingId } : pin
        ));
        setEditingId(null);
      } else {
        // Add new pin
        const newPin = await pinApi.createPin(processedFormData);
        setPins([...pins, newPin]);
      }
      
      // Reset form
      setFormData({
        title: '',
        image: '',
        imageOriginal: '',
        user: '',
        category: '',
        description: '',
        price: '',
        currency: 'INR',
        tags: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error saving pin:', error);
    }
  };

  const handleEdit = (pin) => {
    setFormData({
      title: pin.title,
      image: pin.image,
      imageOriginal: pin.imageOriginal || '',
      user: pin.user,
      category: pin.category,
      description: pin.description,
      price: pin.price || '',
      currency: pin.currency || 'INR',
      tags: pin.tags ? Array.isArray(pin.tags) ? pin.tags.join(', ') : pin.tags : ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(pin.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pin?')) {
      try {
        await pinApi.deletePin(id);
        setPins(pins.filter(pin => pin.id !== id));
      } catch (error) {
        console.error('Error deleting pin:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await categoryApi.createCategory({ name: newCategoryName.trim() });
      // Reload categories
      const updatedCategories = await categoryApi.getCategories();
      const categoryNames = updatedCategories.map(cat => 
        typeof cat === 'string' ? cat : cat.name
      ).filter(name => name);
      setCategories(categoryNames);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category: ' + error.message);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* Admin section header – sits below main site header, no overlap */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Creative Stock content</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pins')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pins'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Pins
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pins' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {editingId ? 'Edit Pin' : 'Add New Pin'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Pin title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    {previewUrl && (
                      <div className="mb-2">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                      )}
                    </div>
                    {formData.image && (
                      <p className="mt-1 text-sm text-green-600">✓ Image uploaded successfully</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <input
                      type="text"
                      name="user"
                      value={formData.user}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="User name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Category</option>
                      {categories.length > 0 ? (
                        categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))
                      ) : (
                        <option value="" disabled>No categories available</option>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Price in INR"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., cotton, traditional, kurta"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Pin description"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {editingId ? 'Update Pin' : 'Add Pin'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          title: '',
                          image: '',
                          user: '',
                          category: '',
                          description: '',
                          price: '',
                          currency: 'INR',
                          tags: ''
                        });
                      }}
                      className="w-full mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Pins List Column */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">All Pins</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pins.map((pin) => (
                        <tr key={pin.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img 
                              src={pin.image} 
                              alt={pin.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pin.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{pin.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pin.user}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {pin.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(pin)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(pin.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Categories</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button 
                onClick={handleAddCategory}
                className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 disabled:opacity-50"
                disabled={!newCategoryName.trim()}
              >
                Add Category
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                    <span className="text-gray-700">{category}</span>
                    <button className="text-red-600 hover:text-red-800">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-4">No categories found. Add some categories above.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;