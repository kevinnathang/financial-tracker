// src/components/ui/ChakraIcon.tsx
import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface ChakraIconProps extends Omit<IconProps, 'as'> {
  icon: IconType;
}

export const ChakraIcon = React.forwardRef<SVGSVGElement, ChakraIconProps>(
  ({ icon, ...props }, ref) => {
    return <Icon as={icon as any} ref={ref} {...props} />;
  }
);

ChakraIcon.displayName = 'ChakraIcon';