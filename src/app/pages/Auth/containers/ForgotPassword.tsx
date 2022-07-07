import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ForgotPasswordImage from 'assets/images/forgot-password.svg';
import Logo from 'assets/images/logo.svg';
import MailSentImage from 'assets/images/mail_sent.svg';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSliceSlice } from 'app/pages/Auth/slice';
import { RootState } from 'types';
import { Link as RouterLink } from 'react-router-dom';

function ForgotPassword() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const isLoading = useSelector(
    (state: RootState) => state.authSlice?.isLoading,
  );
  const isForgotPasswordSuccess = useSelector(
    (state: RootState) => state.authSlice?.isForgotPasswordSuccess,
  );
  const error = useSelector(
    (state: RootState) => state.authSlice?.errorMessage,
  );
  const onSubmit = params => {
    dispatch(actions.forgotPassword(params));
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const forgotFields = [
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      placeholder: 'Email',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: 'Invalid email address',
        },
      },
    },
  ];

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        title: error,
      });

      dispatch(actions.clearForgotPassword());
    }
  }, [error]);

  return (
    <Center height="full" width="full">
      <Center
        mt={32}
        w={400}
        flexDir="column"
        border="1px solid"
        borderColor="gray.200"
        p={8}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!isForgotPasswordSuccess ? (
          <>
            <Image height={50} src={Logo} alt="Forgot Password" />
            <Text fontSize="xl" fontWeight="bold" my={5}>
              Lost your password?
            </Text>
            {forgotFields.map(field => (
              <FormControl
                mb={3}
                key={field.label}
                isInvalid={errors[field.name]}
              >
                <FormLabel htmlFor={field.name}>{field.label}</FormLabel>

                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  {...register(field.name, field.validation)}
                />

                <FormErrorMessage fontSize="sm">
                  {errors[field.name] ? errors[field.name].message : ''}
                </FormErrorMessage>
              </FormControl>
            ))}
            <Button
              mt={4}
              isFullWidth
              colorScheme="purple"
              isLoading={isLoading}
              disabled={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </>
        ) : (
          <>
            <Image height={100} src={MailSentImage} mb={10} />
            <Text textAlign="center">
              Please check your email inbox to reset password!
            </Text>
          </>
        )}
        <Box display="flex" mt={5}>
          <Text fontSize="sm" display="inline">
            Back to
          </Text>
          &nbsp;
          <Link
            fontSize="sm"
            as={RouterLink}
            to="/auth/login"
            color="purple.500"
          >
            Login
          </Link>
        </Box>
      </Center>
    </Center>
  );
}

export default ForgotPassword;
