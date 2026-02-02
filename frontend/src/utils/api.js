import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const pinApi = {
    getPins: async () => {
        try {
            const response = await api.get('/pins');
            return response.data;
        } catch (error) {
            console.error('Error fetching pins:', error);
            // Return empty array to prevent frontend crash on initial load if backend is down
            return [];
        }
    },
    createPin: async (data) => {
        try {
            const response = await api.post('/pins', data);
            return response.data;
        } catch (error) {
            console.error('Error creating pin:', error);
            throw error;
        }
    },
    updatePin: async (id, data) => {
        // Not implemented in backend yet, keeping mock for now or implement if needed
        console.log('updatePin', id, data);
        return { ...data, id };
    },
    deletePin: async (id) => {
        try {
            await api.delete(`/pins/${id}`);
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

