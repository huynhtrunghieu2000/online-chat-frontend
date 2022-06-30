import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

const LoadingBackdrop = ({ isShow }) => {
  return isShow ? (
    <Box
      height="full"
      width="full"
      pos="absolute"
      top={0}
      left={0}
      zIndex={100}
      backgroundColor="whiteAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={4}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.500"
        size="xl"
      />
    </Box>
  ) : (
    <></>
  );
};

export default LoadingBackdrop;
