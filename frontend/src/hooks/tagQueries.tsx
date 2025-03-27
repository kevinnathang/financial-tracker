// src/hooks/tagQueries.ts
import { useQuery, useMutation } from 'react-query';
import tagService, { 
  TagListResponse,
  TagPayload
} from '../services/tagService';

// Query keys
export const TAG_KEYS = {
  all: ['tags'] as const,
  lists: () => [...TAG_KEYS.all, 'list'] as const,
};

// Get tags
export const useTags = () => {
  return useQuery<TagListResponse, Error>(
    TAG_KEYS.lists(),
    tagService.getTags
  );
};

// Create new tag
export const useCreateTag = () => {
  return useMutation<any, Error, TagPayload>(
    (tag) => tagService.createTag(tag)
  )
}