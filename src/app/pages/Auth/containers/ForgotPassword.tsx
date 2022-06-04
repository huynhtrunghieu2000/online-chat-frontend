import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import ForgotPasswordImage from 'assets/images/forgot-password.svg';

function ForgotPassword() {
  return (
    <Box>
      <Image src={ForgotPasswordImage} alt="Forgot Password" />
    </Box>
  );
}

export default ForgotPassword;
