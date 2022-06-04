/**
 *
 * NavigationBar
 *
 */
import React, { memo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

import LogoImage from 'assets/images/logo.svg';
import { APP_NAME } from 'app/core/constants/general';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useAuthSliceSlice } from 'app/pages/Auth/slice';
import { TabNavigator } from '../TabNavigator';
import {
  EventNote,
  Forum,
  Home,
  MeetingRoom,
  Person,
} from '@mui/icons-material';
interface Props {}

export const NavigationBar = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const history = useHistory();

  const tabList = [
    // {
    //   name: 'Dashboard',
    //   path: '/dashboard',
    //   icon: Home,
    // },
    {
      name: 'Room',
      path: '/rooms',
      icon: MeetingRoom,
    },
    {
      name: 'Messenger',
      path: '/messenger',
      icon: Forum,
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: EventNote,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: Person,
    },
  ];
  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  return (
    <Box
      px={4}
      w="100%"
      bg="white"
      shadow="md"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      zIndex={1}
    >
      <Box flex={1} display="flex" alignItems="center" py={2}>
        <Image src={LogoImage} alt={APP_NAME} w={12} h={12} />
        {!userData?.id && (
          <Text fontSize="lg" fontWeight="bold" pl={2}>
            {APP_NAME}
          </Text>
        )}
      </Box>
      {userData?.id && (
        <Box flex={1}>
          <TabNavigator list={tabList} onTabChange={history.push} />
        </Box>
      )}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {!userData?.id ? (
          <>
            <Link as={RouterLink} to="/auth/login" mr={4}>
              Login
            </Link>
            <Link as={RouterLink} to="/auth/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <Button mr={2} onClick={handleLogout}>
              Log out
            </Button>
            <Avatar colorScheme="purple" size="md" name={userData.email} />
          </>
        )}
      </Box>
    </Box>
  );
});
