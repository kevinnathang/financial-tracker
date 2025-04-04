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
}

export interface TagPayload {
  name: string;
  color: string;
  icon?: string | null;
}

export interface CreateTagResponse {
  message: string;
  tag: Tag;
}

export const tagService = {
  createTag: async (tag: TagPayload): Promise<CreateTagResponse> => {
    try {
      const response = await api.post('/tag', tag);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createTag:', error);
      throw error; 
    }
  },
  
  getTags: async (): Promise<TagListResponse> => {
    try {
      const response = await api.get('/tag');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getTags:', error);
      throw error; 
    }
  },

  deleteTag: async(tagId: string) => {
    try {
      const response = await api.delete(`/tag/${tagId}`);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in deleteTag:', error);
      throw error; 
    }
  }
};

export default tagService;