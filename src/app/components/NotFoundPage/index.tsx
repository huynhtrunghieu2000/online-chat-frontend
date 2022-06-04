import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Image, Text } from '@chakra-ui/react';
import NotFoundImg from 'assets/images/404.svg';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image src={NotFoundImg} height="50%" />
      </Box>
    </>
  );
}
