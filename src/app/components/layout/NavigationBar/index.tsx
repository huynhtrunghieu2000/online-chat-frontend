/**
 *
 * NavigationBar
 *
 */
import React, { memo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Text,
} from '@chakra-ui/react';
import { PopoverTrigger } from 'app/components/PopoverTrigger';
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
  ExitToApp,
  Forum,
  Home,
  MeetingRoom,
  Notifications,
  Person,
} from '@mui/icons-material';
import NotificationBody from './NotificationBody';
import { FiberManualRecord } from '@mui/icons-material';
interface Props {}

export const NavigationBar = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const history = useHistory();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
    // {
    //   name: 'Messenger',
    //   path: '/messenger',
    //   icon: Forum,
    // },
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

  const handleLogout = () => {
    dispatch(actions.logout());
  };

  const avatarMenu = [
    {
      name: 'Logout',
      handler: handleLogout,
      icon: ExitToApp,
      color: 'red.500',
    },
  ];
  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const unreadNotificationCount = userData?.notifications?.reduce(
    (prev, notification) => (notification.is_read ? prev : prev + 1),
    0,
  );
  const markAllRead = () => {
    dispatch(
      actions.updateReadNotification({
        is_read: true,
        ids: userData?.notifications?.map(notification => notification.id),
      }),
    );
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
      zIndex={100}
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
            <Popover
              colorScheme="purple"
              onClose={() => setIsNotificationsOpen(false)}
              onOpen={() => setIsNotificationsOpen(true)}
              size="xl"
            >
              <PopoverTrigger>
                <Box pos="relative">
                  <IconButton
                    aria-label="notification"
                    isRound
                    size="lg"
                    mr={2}
                    color={isNotificationsOpen ? 'purple.500' : 'gray.600'}
                    backgroundColor={isNotificationsOpen ? 'purple.100' : ''}
                    _focus={{
                      boxShadow: 'none',
                    }}
                  >
                    <Icon as={Notifications} />
                  </IconButton>
                  {unreadNotificationCount > 0 && !isNotificationsOpen ? (
                    <Icon
                      as={FiberManualRecord}
                      pos="absolute"
                      top={-1}
                      right={1}
                      w={'22px'}
                      h={'22px'}
                      color="purple.500"
                    />
                  ) : (
                    ''
                  )}
                </Box>
              </PopoverTrigger>
              <PopoverContent
                mr={4}
                outline="none"
                width={400}
                _focus={{
                  boxShadow: 'none',
                }}
                maxH={500}
                overflow="scroll"
              >
                <PopoverHeader
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontWeight="bold" fontSize="xl">
                    Notifications
                  </Text>
                  <Box>
                    <Text
                      fontSize="smaller"
                      textDecor="underline"
                      cursor="pointer"
                      color="gray.600"
                      onClick={markAllRead}
                    >
                      Mark all as read
                    </Text>
                  </Box>
                </PopoverHeader>
                <PopoverBody>
                  <NotificationBody />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Menu>
              <MenuButton>
                <Avatar
                  colorScheme="purple"
                  size="md"
                  src={userData?.avatar}
                  name={userData.email}
                />
              </MenuButton>
              <MenuList>
                {avatarMenu.map(item => (
                  <MenuItem
                    key={item.name}
                    onClick={item.handler}
                    color={item.color}
                    display="flex"
                    justifyContent="space-between"
                  >
                    {item.name}
                    <Icon as={item.icon} />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
});
