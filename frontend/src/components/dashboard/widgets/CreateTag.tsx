import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  Spinner,
  Text,
  useToast,
  Select,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import * as Icons from 'react-icons/fi';
import { useCreateTag, useTags, useDeleteTag, useUpdateTag } from '../../../hooks/tagQueries';
import { ChakraIcon } from '../../ui/ChakraIcon';
import { Tag } from '../../../services/tagService';
interface HSV {
  h: number;
  s: number;
  v: number;
}

const hexToHsv = (hex: string): HSV => {
  hex = hex.replace(/^#/, '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return { h, s, v };
};

const hsvToHex = (h: number, s: number, v: number): string => {
  let r: number, g: number, b: number;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }

  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ColorPicker = ({ value, onChange }: {value: string, onChange: (color: string) => void}) => {
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value));
  
  React.useEffect(() => {
    setHsv(hexToHsv(value));
  }, [value]);

  const updateColor = (newHsv: HSV): void => {
    const updatedHsv = {
      h: Math.max(0, Math.min(1, newHsv.h)),
      s: Math.max(0, Math.min(1, newHsv.s)),
      v: Math.max(0, Math.min(1, newHsv.v))
    };
    
    const hexColor = hsvToHex(updatedHsv.h, updatedHsv.s, updatedHsv.v);
    setHsv(updatedHsv);
    onChange(hexColor);
  };

  const handleHueChange = (val: number): void => {
    updateColor({ ...hsv, h: val / 360 });
  };

  const handleSaturationChange = (val: number): void => {
    updateColor({ ...hsv, s: val / 100 });
  };

  const handleValueChange = (val: number): void => {
    updateColor({ ...hsv, v: val / 100 });
  };

  const currentColor = hsvToHex(hsv.h, hsv.s, hsv.v);

  return (
    <VStack spacing={4} width="100%">
      <Box 
        width="100%" 
        height="60px" 
        borderRadius="md" 
        bg={currentColor}
        border="1px solid" 
        borderColor="gray.200"
      />

      <FormControl>
        <FormLabel>Hue</FormLabel>
        <Box position="relative">
          <Slider 
            value={hsv.h * 360} 
            onChange={handleHueChange} 
            min={0} 
            max={360}
          >
            <SliderTrack 
              bgGradient="linear(to-r, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00)"
              height="12px"
              borderRadius="md"
            >
              <SliderFilledTrack bg="transparent" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel>Saturation</FormLabel>
        <Box position="relative">
          <Slider 
            value={hsv.s * 100} 
            onChange={handleSaturationChange} 
            min={0} 
            max={100}
          >
            <SliderTrack 
              bgGradient={`linear(to-r, ${hsvToHex(hsv.h, 0, hsv.v)}, ${hsvToHex(hsv.h, 1, hsv.v)})`}
              height="12px"
              borderRadius="md"
            >
              <SliderFilledTrack bg="transparent" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel>Brightness</FormLabel>
        <Box position="relative">
          <Slider 
            value={hsv.v * 100} 
            onChange={handleValueChange} 
            min={0} 
            max={100}
          >
            <SliderTrack 
              bgGradient={`linear(to-r, #000, ${hsvToHex(hsv.h, hsv.s, 1)})`}
              height="12px"
              borderRadius="md"
            >
              <SliderFilledTrack bg="transparent" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </Box>
      </FormControl>

      <Text fontSize="sm" alignSelf="flex-end">
        {currentColor.toUpperCase()}
      </Text>
    </VStack>
  );
};

const TagManagement: React.FC = () => {
  const { data, isLoading, isError } = useTags();
  const [ name, setName ] = useState('');
  const [ color, setColor ] = useState('#3182CE');
  const [ icon, setIcon ] = useState('💵');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
  const [ selectedTag, setSelectedTag ] = useState<Tag | undefined>(undefined);
  const tagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const toast = useToast();
  const { mutate: deleteTag } = useDeleteTag();
  
  if (isLoading) {
    return (
      <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" textAlign="center">
        <Spinner size="md" />
        <Text mt={2}>Loading tags...</Text>
      </Box>
    );
  }
  
  if (isError || !data) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="lg">
        <Text>Unable to load tags. Please try again later.</Text>
      </Box>
    );
  }

  const handleDelete = (tagId: string) => {
    deleteTag(tagId);
  };

  const openEditModal = (tag: Tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTag(undefined);
  };

  const handleUpdate = async () => {
    if (!selectedTag) return;

    if (!selectedTag.name || !selectedTag.color) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateTagMutation.mutateAsync({
        tagId: selectedTag.id,
        name: selectedTag.name,
        color: selectedTag.color, 
        icon: selectedTag.icon,
      });
      
      toast({
        title: 'Success',
        description: 'Tag updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      closeEditModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update tag',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tags = data.tags || [];
  
  const handleSubmit = async (e: any) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!name || !color) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await tagMutation.mutateAsync({
        name: name,
        color: color,
        icon: icon,
      });
      
      toast({
        title: 'Success',
        description: 'Tag created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create tag',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setColor('#3182CE');
    setIcon('💵');
  };
  
  const emojiOptions = [
    { value: '💵', label: 'Cash' },
    { value: '📈', label: 'Increase' },
    { value: '📉', label: 'Decrease' },
    { value: '📚', label: 'Studies' },
    { value: '💸', label: 'Expense' },
    { value: '⛽', label: 'Gas' },
    { value: '🏋️', label: 'Sports' },
    { value: '🍕', label: 'Food' },
    { value: '🏠', label: 'Housing' },
    { value: '🚗', label: 'Transportation' },
    { value: '💊', label: 'Healthcare' },
    { value: '🎮', label: 'Entertainment' },
    { value: '👜', label: 'Shopping' },
    { value: '✈️', label: 'Travel' }
  ];
  
  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} p={4}>
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Create New Tag</Text>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!name && isSubmitting}>
                <FormLabel>Tag Name</FormLabel>
                <Input 
                  placeholder="Enter tag name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {!name && isSubmitting && (
                  <FormErrorMessage>Tag name is required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl>
                <FormLabel>Color</FormLabel>
                <ColorPicker value={color} onChange={setColor} />
              </FormControl>
              
              <FormControl>
                <FormLabel>Icon</FormLabel>
                <Select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  {emojiOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value} {option.label}
                    </option>
                  ))}
                </Select>
                <Flex mt={2} justify="center">
                  <Box p={2} borderWidth="1px" borderRadius="md" fontSize="24px">
                    {icon}
                  </Box>
                </Flex>
              </FormControl>
              
              <HStack spacing={4} justify="flex-end" pt={4}>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  isDisabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button 
                  colorScheme="blue" 
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Creating"
                >
                  Create Tag
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </GridItem>
      
      <GridItem>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" height="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Your Tags</Text>
          
          {tags && tags.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {tags.map((tag) => (
                <HStack key={tag.id} p={3} borderWidth="1px" borderRadius="md" justifyContent="space-between">
                  <HStack spacing={3}>
                    <Box fontSize="24px">{tag.icon}</Box>
                    <Text fontWeight="medium">{tag.name}</Text>
                    <Box 
                      width="12px" 
                      height="12px" 
                      borderRadius="full" 
                      bg={tag.color}
                    />
                  </HStack>
                  <HStack>
                    <IconButton
                      aria-label="Edit Tag"
                      icon={<ChakraIcon icon={Icons.FiEdit} />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => openEditModal(tag)}
                    />
                    <IconButton
                      aria-label="Delete Tag"
                      icon={<ChakraIcon icon={Icons.FiTrash2} />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(tag.id)}
                    />
                  </HStack>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="md" borderStyle="dashed">
              <Text color="gray.500">No tags created yet</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Create a tag using the form on the left
              </Text>
            </Box>
          )}
        </Box>
      </GridItem>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTag && (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!selectedTag.name && isSubmitting}>
                  <FormLabel>Tag Name</FormLabel>
                  <Input 
                    placeholder="Enter tag name"
                    value={selectedTag.name}
                    onChange={(e) => setSelectedTag({...selectedTag, name: e.target.value})}
                  />
                  {!selectedTag.name && isSubmitting && (
                    <FormErrorMessage>Tag name is required</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <ColorPicker 
                    value={selectedTag.color} 
                    onChange={(color: any) => setSelectedTag({...selectedTag, color})} 
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    value={selectedTag.icon || ''}
                    onChange={(e) => setSelectedTag({...selectedTag, icon: e.target.value})}
                  >
                    {emojiOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.value} {option.label}
                      </option>
                    ))}
                  </Select>
                  <Flex mt={2} justify="center">
                    <Box p={2} borderWidth="1px" borderRadius="md" fontSize="24px">
                      {selectedTag.icon}
                    </Box>
                  </Flex>
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeEditModal}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdate}
              isLoading={isSubmitting}
              loadingText="Updating"
              isDisabled={!selectedTag}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default TagManagement;