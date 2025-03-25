import React from 'react';
import {
  Box,
  Container,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';

const ResponsiveLayout = ({ children, maxW = 'container.xl', ...props }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const padding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const marginTop = useBreakpointValue({ base: 4, md: 6, lg: 8 });

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      py={padding}
      px={{ base: 2, md: 4, lg: 6 }}
      {...props}
    >
      <Container
        maxW={maxW}
        mt={marginTop}
        mb={marginTop}
        px={{ base: 2, md: 4, lg: 6 }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default ResponsiveLayout; 