// src/hooks/tagQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
    tagService.getTags,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  );
};

// Create new tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, TagPayload>(
    (tag) => tagService.createTag(tag),
    {
      onSuccess: () => {
        // Invalidate and refetch the tags list after creating a new tag
        queryClient.invalidateQueries(TAG_KEYS.lists());
      }
    }
  );
};