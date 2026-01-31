export const pinApi = {
    getPins: async () => {
        return [];
    },
    createPin: async (data) => {
        console.log('createPin', data);
        return { ...data, id: Date.now() };
    },
    updatePin: async (id, data) => {
        console.log('updatePin', id, data);
        return { ...data, id };
    },
    deletePin: async (id) => {
        console.log('deletePin', id);
        return true;
    }
};

export const categoryApi = {
    getCategories: async () => {
        return ['Nature', 'Abstract', 'People'];
    },
    createCategory: async (data) => {
        console.log('createCategory', data);
        return data;
    }
};

export const uploadApi = {
    uploadImage: async (file) => {
        console.log('uploadImage', file);
        return {
            url: URL.createObjectURL(file),
            originalUrl: URL.createObjectURL(file)
        };
    }
};
