import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        username: '',
        full_name: '',
        avatar_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            toast.error("Error fetching auth data");
            setLoading(false);
            return;
        }

        setUser(user);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setProfile({
                username: data.username || '',
                full_name: data.full_name || '',
                avatar_url: data.avatar_url || ''
            });
        }
        setLoading(false);
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: publicUrl });
            toast.success("Image uploaded! Click Save to confirm.");

        } catch (error) {
            toast.error(error.message || "Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updates = {
            id: user.id,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            if (error.code === '23505') {
                toast.error("Username is already taken!");
            } else {
                toast.error(error.message);
            }
        } else {
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        }
        setSaving(false);
    };

    const getInitial = (email) => {
        return email ? email.charAt(0).toUpperCase() : '?';
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 text-red-600 font-bold">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
                            <p className="text-gray-500 font-medium">Manage your personal information and preferences.</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                Edit Profile
                            </button>
                        )}
                    </header>

                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center sticky top-28">
                                <div className="relative group mx-auto mb-6 w-32 h-32">
                                    <div className={`w-full h-full bg-red-100 rounded-full flex items-center justify-center text-red-600 text-4xl font-black border-4 border-white shadow-md overflow-hidden transition-all ${isEditing ? 'cursor-pointer hover:bg-red-200' : ''}`}>
                                        {uploading ? (
                                            <div className="animate-pulse text-sm">Uploading...</div>
                                        ) : profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            getInitial(user?.email)
                                        )}
                                    </div>

                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                            />
                                            <span className="text-white text-xs font-bold px-2 pointer-events-none text-center">Change Photo</span>
                                        </label>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1 truncate px-2">{profile.full_name || user?.email?.split('@')[0]}</h2>
                                <p className="text-gray-500 mb-6 font-medium text-sm truncate px-4">@{profile.username || 'username'}</p>

                                <div className="pt-6 border-t border-gray-50 flex flex-col gap-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Social Stats</p>
                                    <div className="flex justify-around">
                                        <div>
                                            <p className="font-black text-gray-900">0</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Pins</p>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">0</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Boards</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {isEditing ? 'Edit Profile Details' : 'Account Information'}
                                    </h3>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-black uppercase tracking-tighter rounded-full border border-green-100">Verified</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-500 font-medium truncate italic cursor-not-allowed">
                                            {user?.email}
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.full_name}
                                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                    placeholder="Your full name"
                                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Username</label>
                                                <input
                                                    type="text"
                                                    value={profile.username}
                                                    onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                                                    placeholder="unique_username"
                                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 p-4 bg-red-50 rounded-2xl border-2 border-red-100 border-dashed">
                                                <p className="text-xs font-bold text-red-600 uppercase mb-2">Pro Tip</p>
                                                <p className="text-sm text-red-500 font-medium italic">Click on the avatar circle on the left to upload a new profile picture!</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                                <div className="w-full px-5 py-4 bg-white border-2 border-gray-50 rounded-2xl text-gray-900 font-bold">
                                                    {profile.full_name || 'Not set'}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                                                <div className="w-full px-5 py-4 bg-white border-2 border-gray-50 rounded-2xl text-red-600 font-black">
                                                    @{profile.username || 'username'}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1 disabled:bg-gray-300"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchProfile(); // Reset to current db values
                                            }}
                                            className="px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {!isEditing && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-400 font-medium italic">Joined Creative Stock on {new Date(user?.created_at).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;
