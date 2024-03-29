import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { APP_NAME } from 'app/core/constants/general';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSliceSlice } from '../slice';
import { RootState } from 'types';
import EmailSentImage from 'assets/images/mail_sent.svg';

function Register() {
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isRegisterSuccess = useSelector(
    (state: RootState) => state.authSlice?.isRegisterSuccess,
  );
  const isLoading = useSelector(
    (state: RootState) => state.authSlice?.isLoading,
  );
  const error = useSelector(
    (state: RootState) => state.authSlice?.errorMessage,
  );

  const registerFields = [
    {
      name: 'email',
      label: 'Email',
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
    {
      name: 'first_name',
      label: 'First name',
      type: 'text',
      placeholder: 'First name',
      validation: {
        required: 'First name is required',
      },
    },
    {
      name: 'last_name',
      label: 'Last name',
      type: 'text',
      placeholder: 'Last name',
      validation: {
        required: 'Last name is required',
      },
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'text',
      placeholder: 'Something about you',
      validation: {
        required: 'Bio is required',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      },
    },
    {
      name: 'rePassword',
      label: 'Confirm password',
      type: 'password',
      placeholder: 'Confirm your password',
      validation: {
        required: 'Confirm password is required',
        validate: (value: string) => {
          const password = getValues('password');
          return value === password || 'Password do not match';
        },
      },
    },
  ];
  const onSubmit = params => {
    dispatch(actions.register(params));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.clearRegister());
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        title: 'Register failed',
        description: error,
      });

      dispatch(actions.clearRegister());
    }
  }, [error]);

  return (
    <Box overflow="scroll">
      <Helmet>
        <title>Register</title>
      </Helmet>

      <Center
        w="full"
        mt={24}
        flexDirection="column"
        overflow="scroll"
        borderRadius={4}
        pb={16}
      >
        {/* <Image src={LogoImage} w={20} h={20} mb={5} /> */}
        {!isRegisterSuccess ? (
          <>
            <Text fontSize="3xl" fontWeight="extrabold" lineHeight={1.2}>
              Welcome to {APP_NAME}
            </Text>
            <Text fontSize="sm" fontWeight="light" lineHeight={1.2}>
              Tell us some details about you
            </Text>
            <Box
              as="form"
              w={400}
              p={8}
              my={5}
              onSubmit={handleSubmit(onSubmit)}
              border="1px solid"
              borderColor="gray.300"
              borderRadius={4}
            >
              <Text
                fontSize="2xl"
                fontWeight="extrabold"
                lineHeight={1.2}
                mb={5}
                textAlign="center"
              >
                Register
              </Text>
              {registerFields.map(field => (
                <FormControl
                  mb={3}
                  key={field.label}
                  isInvalid={errors[field.name]}
                >
                  <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                  {field.type === 'password' ? (
                    <InputGroup>
                      <InputRightElement>
                        <IconButton
                          aria-label="Show password"
                          isRound
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          _focusVisible={{ outline: 'none' }}
                          tabIndex={-1}
                        >
                          <Icon
                            color="gray.500"
                            as={isShowPassword ? ViewIcon : ViewOffIcon}
                          />
                        </IconButton>
                      </InputRightElement>
                      <Input
                        id={field.name}
                        placeholder={field.placeholder}
                        type={isShowPassword ? 'text' : 'password'}
                        {...register(field.name, field.validation)}
                      />
                    </InputGroup>
                  ) : (
                    <Input
                      id={field.name}
                      placeholder={field.placeholder}
                      type={field.type}
                      {...register(field.name, field.validation)}
                    />
                  )}
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
                type="submit"
              >
                Register
              </Button>
            </Box>
            <Box display="flex" mt={5}>
              <Text fontSize="sm" display="inline">
                Already have account?
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
          </>
        ) : (
          <Center
            flexDir="column"
            borderRadius={4}
            border="1px solid"
            borderColor="gray.200"
            p={8}
          >
            <Image src={EmailSentImage} h="100px" mb={6} />
            <Text>Please check your email to verify account.</Text>
          </Center>
        )}
      </Center>
    </Box>
  );
}

export default Register;
