// src/hooks/tagQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import tagService, {
  TagListResponse,
  TagPayload
} from '../services/tagService';

export const TAG_KEYS = {
  all: ['tags'] as const,
  lists: () => [...TAG_KEYS.all, 'list'] as const,
};

export const useTags = () => {
  return useQuery<TagListResponse, Error>(
    TAG_KEYS.lists(),
    tagService.getTags,
    {
      staleTime: 5 * 60 * 1000, 
      retry: 2
    }
  );
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, TagPayload>(
    (tag) => tagService.createTag(tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TAG_KEYS.lists());
      }
    }
  );
};