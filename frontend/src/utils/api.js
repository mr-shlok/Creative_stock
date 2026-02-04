import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = 'http://localhost:8000';

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
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath);

            return {
                url: publicUrl,
                originalUrl: publicUrl
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
};

