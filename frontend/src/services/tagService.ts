// src/services/tagService.ts
import api from './api';

export interface Tag {
    id: string;
    name: string;
    color: string;
    icon: string | null;
    user_id: string;
}

export interface TagListResponse {
    tags: Tag[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}

export interface TagPayload {
    name: string;
    color?: string;
    icon?: string | null;
}

export const tagService = {
    // Create tags
    createTag: async (tag: TagPayload) => {
        const response = await api.post('/tag', tag);
        return response.data;
    },
    // Get user tag
    getTags: async () => {
        const response = await api.get('/tag');
        return response.data;
    },
};
  
export default tagService;