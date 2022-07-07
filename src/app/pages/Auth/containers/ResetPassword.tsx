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
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { APP_NAME } from 'app/core/constants/general';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSliceSlice } from '../slice';
import { RootState } from 'types';
import EmailSentImage from 'assets/images/mail_sent.svg';

const ResetPassword = ({ token }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isResetPasswordSuccess = useSelector(
    (state: RootState) => state.authSlice?.isResetPasswordSuccess,
  );
  const isLoading = useSelector(
    (state: RootState) => state.authSlice?.isLoading,
  );

  const resetPasswordFields = [
    {
      name: 'new_password',
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
      name: 'repeat_new_password',
      label: 'Confirm password',
      type: 'password',
      placeholder: 'Confirm your password',
      validation: {
        required: 'Confirm password is required',
        validate: (value: string) => {
          const password = getValues('new_password');
          return value === password || 'Password do not match';
        },
      },
    },
  ];
  const onSubmit = params => {
    const data = {
      token,
      ...params,
    };
    dispatch(actions.resetPassword(data));
  };

  useEffect(() => {
    if (isResetPasswordSuccess) {
      toast({
        status: 'success',
        title: 'Reset password successfully',
        description: 'Success! You can login with new password',
      });

      history.push('/auth/login');
      dispatch(actions.clearResetPassword());
    }
  }, [isResetPasswordSuccess]);

  return (
    <Box width={350} as="form" onSubmit={handleSubmit(onSubmit)}>
      {resetPasswordFields.map(field => (
        <FormControl mb={3} key={field.label} isInvalid={errors[field.name]}>
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
        Submit
      </Button>
    </Box>
  );
};

export default ResetPassword;
