// src/hooks/tagQueries.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import tagService from '../services/tagService';
import { Tag } from '../types';

export const TAG_KEYS = {
  all: ['tags'] as const,
  lists: () => [...TAG_KEYS.all, 'list'] as const,
};

export const useTags = () => {
  return useQuery<Tag.TagListResponse, Error>(
    TAG_KEYS.lists(),
    tagService.getAllTags,
    {
      staleTime: 5 * 60 * 1000, 
      retry: 2
    }
  );
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, Tag.TagPayload>(
    (tag) => tagService.createTag(tag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TAG_KEYS.lists());
        queryClient.invalidateQueries(TAG_KEYS.all);

      },
      onError: (error) => {
        console.error(`QUERY - Error using useCreateTag. ${error}`);
      },
    }
  );
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    async (tagId) => {
      const response = await tagService.deleteTag(tagId);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TAG_KEYS.lists());
        queryClient.invalidateQueries(TAG_KEYS.all);
        queryClient.invalidateQueries('userData');
        queryClient.invalidateQueries('transactions')

      },
      onError: (error, tagId) => {
        console.error(`QUERY - Error deleting tag with ID: ${tagId}`);
      },
    }
  );
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, Tag.UpdateTagPayload>(
    async ({ tagId, ...tagData }) => {
      const response = await tagService.updateTag(tagId, tagData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TAG_KEYS.lists());
        queryClient.invalidateQueries(TAG_KEYS.all);
        queryClient.invalidateQueries('userData');
        queryClient.invalidateQueries('transactions')
      },
      onError: (error, { tagId }) => {
        console.error(`QUERY - Error Updating transaction with ID: ${tagId}`);
      },
    }
  );
};