import axios from 'axios';

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
        // In a real app, this would upload to Supabase Storage and return the URL.
        // For now, we'll just fake it as per the existing logic OR we could implement real upload.
        // Keeping it simple as requested for connection first.
        console.log('uploadImage', file);
        return {
            url: URL.createObjectURL(file),
            originalUrl: URL.createObjectURL(file)
        };
    }
};

