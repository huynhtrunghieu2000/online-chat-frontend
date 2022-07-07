import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import AvatarUpload from '../../components/AvatarUpload';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useAuthSliceSlice } from '../Auth/slice/index';
import { Route, useHistory } from 'react-router-dom';
import ChangePassword from '../Auth/containers/ChangePassword';

interface Props {}

const Profile = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const history = useHistory();
  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const isUpdateSuccess = useSelector(
    (state: RootState) => state.authSlice?.isUpdateProfileSuccess,
  );

  const infoForm = [
    {
      name: 'email',
      label: 'Email',
      defaultValue: userData?.email,
      disabled: true,
    },
    {
      name: 'bio',
      label: 'Bio',
      defaultValue: userData?.bio,
      validation: {
        maxLength: {
          value: 50,
          message: 'Minimum length should be 4',
        },
      },
    },
    {
      name: 'first_name',
      label: 'First name',
      defaultValue: userData?.first_name,
      validation: {
        required: 'This is required',
        maxLength: {
          value: 20,
          message: 'Maximum length is 20 characters',
        },
      },
    },
    {
      name: 'last_name',
      label: 'Last name',
      defaultValue: userData?.last_name,
      validation: {
        required: 'This is required',
        maxLength: {
          value: 20,
          message: 'Maximum length is 20 characters',
        },
      },
    },
  ];

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  React.useEffect(() => {
    return () => {
      dispatch(actions.clearUpdateProfile());
    };
  }, []);

  React.useEffect(() => {
    if (userData) {
      infoForm.forEach(item => setValue(item.name, item.defaultValue));
    }
  }, [userData]);

  React.useEffect(() => {
    if (isUpdateSuccess) {
      toast({
        title: 'Update info success',
        description: 'Your info is updated',
        status: 'success',
        duration: 2000,
      });
    }
  }, [isUpdateSuccess]);

  const updateUserProfile = data => {
    console.log(data);
    const userProfile = {
      ...userData,
      ...data,
    };
    console.log(userProfile);
    dispatch(actions.updateProfile(userProfile));
  };

  const onSubmit = values => {
    updateUserProfile(values);
  };

  return (
    <Container maxW="4xl">
      <Text textAlign="center" fontSize="2xl" fontWeight="bold" my={8}>
        Update your profile
      </Text>
      <Box display="flex" mt={4}>
        <Box flex={3} display="flex" alignItems="center" flexDir="column">
          <AvatarUpload
            initAvatar={userData?.avatar}
            name={userData?.first_name || userData?.last_name}
            saveCallback={updateUserProfile}
          />
        </Box>
        <Box
          flex={7}
          pos="relative"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDir="column"
          mt={2}
        >
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            Personal Information
          </Text>
          <Divider color="gray.500" mb={4} />
          {infoForm.map(field => (
            <FormControl isInvalid={errors[field.name]} key={field.name} mb={2}>
              <FormLabel htmlFor="name">{field.label}</FormLabel>
              <Input
                id={field.name}
                placeholder={field.label}
                disabled={field.disabled}
                {...register(field.name, field.validation)}
              />
              <FormErrorMessage>
                {errors[field.name] && errors[field.name].message}
              </FormErrorMessage>
            </FormControl>
          ))}
          <Text fontSize="lg" fontWeight="bold" mb={1} mt={2}>
            Security
          </Text>
          <Divider color="gray.500" mb={4} />
          <Button
            w={200}
            onClick={() => history.push('/profile/change-password')}
            mr={2}
          >
            Change password
          </Button>
          <Box alignSelf="flex-end" mt={4}>
            <Button
              mr={0}
              ml="auto"
              colorScheme="purple"
              isLoading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
