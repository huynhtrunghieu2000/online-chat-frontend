import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useAuthSliceSlice } from '../slice';
import { selectAuthSlice } from '../slice/selectors';
import { RootState } from 'types';
import {
  Box,
  Center,
  Icon,
  Image,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import DoneImage from 'assets/images/done-illustration.svg';
import ResetPassword from './ResetPassword';

const ForgotPasswordVerify = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const isVerified = useSelector(
    (state: RootState) => state?.authSlice?.data?.status,
  );
  console.log(isVerified);
  const isLoading = useSelector(
    (state: RootState) => state?.authSlice?.isLoading,
  );
  useEffect(() => {
    if (token) {
      dispatch(actions.forgotPasswordVerify(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Spinner
      color="primary"
      thickness="5px"
      size="xl"
      pos="fixed"
      top="50%"
      left="50%"
    />
  ) : (
    <Center display="flex" flexDir="column" mt={24}>
      {isVerified ? (
        <Center
          display="flex"
          flexDir="column"
          p={8}
          border="1px solid"
          borderColor="gray.300"
          borderRadius={4}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={5}>
            Reset password
          </Text>

          <ResetPassword token={token} />
        </Center>
      ) : (
        <>
          <Icon as={WarningIcon} color="secondary" w="28" h="28" mb={5} />
          <Text fontSize="lg" fontWeight="bold">
            Verification failed, please check again.
          </Text>
          <Link as={RouterLink} to="/auth/login" color="primary">
            Back to login
          </Link>
        </>
      )}
    </Center>
  );
};

export default ForgotPasswordVerify;
