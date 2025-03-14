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

export const tagService = {
    // Get user tag
    getTags: async () => {
        const response = await api.get('/tag');
        return response.data;
    },
};
  
export default tagService;