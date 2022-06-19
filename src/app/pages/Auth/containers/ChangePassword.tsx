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

function ChangePassword() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    reset
  } = useForm();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isChangePasswordSuccess = useSelector(
    (state: RootState) => state.authSlice?.isChangePasswordSuccess,
  );
  const registerFields = [
    {
      name: 'old_password',
      label: 'Old Password',
      type: 'password',
      placeholder: 'Enter your old password',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      },
    },
    {
      name: 'new_password',
      label: 'New Password',
      type: 'password',
      placeholder: 'Enter your new password',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      },
    },
    {
      name: 'repeat_new_password',
      label: 'Confirm new password',
      type: 'password',
      placeholder: 'Confirm your new password',
      validation: {
        required: 'Confirm new password is required',
        validate: (value: string) => {
          const password = getValues('new_password');
          return value === password || 'Password do not match';
        },
      },
    },
  ];
  const onSubmit = params => {
    dispatch(actions.changePassword(params));
  };

  useEffect(() => {
    if (isChangePasswordSuccess) {
      toast({
        title: 'Change password success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearChangePassword());
      reset();
      return () => {
        dispatch(actions.clearChangePassword());
      };
    }
  }, [isChangePasswordSuccess]);

  return (
    <Box>
      <Helmet>
        <title>Change Password</title>
      </Helmet>

      <Center w="full" mt={16} flexDirection="column">
        <Text fontSize="2xl" fontWeight="bold" mb={10}>
          Change Password
        </Text>
        <Box as="form" onSubmit={handleSubmit(onSubmit)} minW={500}>
          {registerFields.map(field => (
            <FormControl
              mb={3}
              key={field.label}
              isInvalid={errors[field.name]}
            >
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
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
                  w="full"
                />
              </InputGroup>
              <FormErrorMessage fontSize="sm">
                {errors[field.name] ? errors[field.name].message : ''}
              </FormErrorMessage>
            </FormControl>
          ))}
          <Button
            mt={4}
            isFullWidth
            colorScheme="purple"
            isLoading={isSubmitting}
            type="submit"
          >
            Change password
          </Button>
        </Box>
      </Center>
    </Box>
  );
}

export default ChangePassword;
