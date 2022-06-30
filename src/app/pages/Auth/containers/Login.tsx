import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Image,
  Text,
  Link,
  Icon,
  IconButton,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import LogoImage from 'assets/images/logo.svg';
import { APP_NAME } from 'app/core/constants/general';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authSliceActions, useAuthSliceSlice } from '../slice';
import { RootState } from 'types';
import { isAuthenticated } from 'app/core/modules/PrivateRoute';
import { useLocation } from 'react-router';

function Login() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const history = useHistory();
  const location = useLocation<any>();
  const from = location.state?.from;

  const [isShowPassword, setIsShowPassword] = useState(false);
  const isLoading = useSelector(
    (state: RootState) => state.authSlice?.isLoading,
  );
  const userData = useSelector((state: RootState) => state.authSlice?.data);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const loginFields = [
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
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      },
    },
  ];

  const onSubmit = params => {
    dispatch(actions.login(params));
  };

  useEffect(() => {
    console.log(from);
    console.log(location);
    if (isAuthenticated()) {
      if (from) history.push(from);
      else history.push('/rooms');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <Center w="full" mt={24} flexDirection="column">
        {/* <Image src={LogoImage} w={20} h={20} mb={5} /> */}
        <Text fontSize="3xl" fontWeight="extrabold" lineHeight={1.2}>
          Welcome to {APP_NAME}
        </Text>
        <Text fontSize="3xl" fontWeight="extrabold" lineHeight={1.2} mb={5}>
          Login to getting started
        </Text>
        <Text fontSize="sm" fontWeight="light" lineHeight={1.2}>
          Login to getting started
        </Text>
        <Box as="form" w="96" p={5} mt={5} onSubmit={handleSubmit(onSubmit)}>
          {loginFields.map(field => (
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

          <Link
            mr={0}
            ml="auto"
            display="block"
            fontSize="sm"
            textAlign="end"
            as={RouterLink}
            to="/auth/forgot-password"
          >
            Forgot password?
          </Link>
          <Button
            mt={4}
            isFullWidth
            colorScheme="purple"
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
          >
            Login
          </Button>
        </Box>
      </Center>
    </div>
  );
}

export default Login;
