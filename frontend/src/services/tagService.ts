// src/services/tagService.ts
import api from './api';
import { Tag } from '../types';

export const tagService = {
  createTag: async (tag: Tag.TagPayload): Promise<Tag.CreateTagResponse> => {
    try {
      const response = await api.post('/tags', tag);
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in createTag:', error);
      throw error; 
    }
  },
  
  getAllTags: async (): Promise<Tag.TagListResponse> => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      console.error('SERVICE - Error in getAllTags:', error);
      throw error; 
    }
  },

  deleteTag: async(tagId: string) => {
    try {
      const response = await api.delete(`/tags/${tagId}`);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in deleteTag:', error);
      throw error; 
    }
  },

  updateTag: async(tagId: string, tagData: Tag.TagPayload): Promise<any> => {
    try {
      const response = await api.patch(`/tags/${tagId}`, tagData);
      return response.data
    } catch (error) {
      console.error('SERVICE - Error in updateTag:', error);
      throw error;
    }
  }
};

export default tagService;