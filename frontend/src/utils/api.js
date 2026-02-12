import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = 'http://localhost:8000';
export const BASE_URL = '';

const api = axios.create({
    baseURL: API_URL,
});

export const pinApi = {
    getPins: async () => {
        try {
            const { data, error } = await supabase
                .from('pins')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching pins:', error);
            return [];
        }
    },
    createPin: async (data) => {
        try {
            const { data: result, error } = await supabase
                .from('pins')
                .insert([data])
                .select();

            if (error) throw error;
            return result[0];
        } catch (error) {
            console.error('Error creating pin:', error);
            throw error;
        }
    },
    updatePin: async (id, data) => {
        try {
            const { data: result, error } = await supabase
                .from('pins')
                .update(data)
                .eq('id', id)
                .select();

            if (error) throw error;
            return result[0];
        } catch (error) {
            console.error('Error updating pin:', error);
            throw error;
        }
    },
    searchPins: async (query) => {
        try {
            const { data, error } = await supabase
                .from('pins')
                .select('*')
                .or(`title.ilike.%${query}%,tags.cs.{${query}}`);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error searching pins:', error);
            return [];
        }
    },
    deletePin: async (pinId) => {
        try {
            const { error } = await supabase
                .from('pins')
                .delete()
                .eq('id', pinId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting pin:', error);
            return false;
        }
    }
};

export const categoryApi = {
    getCategories: async () => {
        return ['Nature', 'Abstract', 'People', 'Tech', 'Art'];
    },
    createCategory: async (data) => {
        console.log('createCategory', data);
        return data;
    }
};

export const boardApi = {
    getBoards: async (userId) => {
        try {
            const response = await api.get('/boards', { params: { user_id: userId } });
            return response.data;
        } catch (error) {
            console.error('Error fetching boards:', error);
            return [];
        }
    },
    createBoard: async (data) => {
        try {
            const response = await api.post('/boards', data);
            return response.data;
        } catch (error) {
            console.error('Error creating board:', error);
            throw error;
        }
    }
};

export const uploadApi = {
    uploadImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { bucket, watermarked_path, original_path } = response.data;

            // Convert storage paths into public URLs using Supabase JS client
            const { data: watermarkedData } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(watermarked_path);

            const { data: originalData } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(original_path);

            return {
                url: watermarkedData.publicUrl,
                originalUrl: originalData.publicUrl,
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
};

export const likeApi = {
    toggleLike: async (pinId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await api.post(`/pins/like/${pinId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Like error:', error);
            throw error;
        }
    },
    checkLike: async (pinId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await api.get(`/pins/likes/${pinId}`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Check like error:', error);
            return { liked: false };
        }
    }
};

export const cartApi = {
    addToCart: async (pinId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await api.post(`/pins/cart/${pinId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    },
    removeFromCart: async (pinId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await api.delete(`/pins/cart/${pinId}`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },
    getCartItems: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await api.get('/pins/cart', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get cart error:', error);
            return { items: [] };
        }
    }
};

