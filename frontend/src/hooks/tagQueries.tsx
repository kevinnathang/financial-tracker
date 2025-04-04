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

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    async (tagId) => {
      console.log(`QUERY - Attempting to delete tag with ID: ${tagId}`);
      const response = await tagService.deleteTag(tagId);
      console.log(`QUERY - Tag ${tagId} deleted successfully`);
      return response;
    },
    {
      onSuccess: () => {
        console.log('QUERY - Delete tag successful, invalidating queries...');
        queryClient.invalidateQueries(TAG_KEYS.lists());
      },
      onError: (error, tagId) => {
        console.error(`QUERY - Error deleting tag with ID: ${tagId}`, error);
      },
      onSettled: () => {
        console.log('QUERY - Delete tag mutation settled (either success or failure).');
      }
    }
  );
};