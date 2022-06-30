import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {
  Abc,
  Event,
  FiberManualRecord,
  Settings,
  Videocam,
} from '@mui/icons-material';
import { useDialog } from 'app/components/Dialog/Dialog';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { RootState } from 'types';
import { useRoomSlice } from '../slice';
import AddEventForRoomDialog from './dialog/AddEventForRoomDialog';

import AddMemberDialog from './dialog/AddMemberDialog';
import CreateChannelDialog from './dialog/CreateChannelDialog';
import MemberDialog from './dialog/MemberDialog';
import UpdateRoomInfoDialog from './dialog/UpdateRoomInfoDialog';

const ChannelSideMenu = () => {
  const dialog = useDialog();
  const toast = useToast();
  const { actions } = useRoomSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const channelTypeIcon = {
    text: Abc,
    video: Videocam,
  };

  const userInfo = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const channelList = useSelector(
    (state: RootState) => state.room?.roomDetail?.Channels,
  );
  const eventList = useSelector(
    (state: RootState) => state.room?.roomDetail?.Events,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isCreateChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isCreateChannelSuccess,
  );
  const isLeaveRoomSuccess = useSelector(
    (state: RootState) => state?.room?.isLeaveRoomSuccess,
  );
  const isAdmin = currentRoom?.Users?.filter(
    user => userInfo?.id === user.id && user.ClassroomMember.role === 'owner',
  ).length;

  useEffect(() => {
    if (isCreateChannelSuccess) {
      toast({
        title: 'Create channel success',
        description: 'Your channel was created successfully',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearCreateChannel());
    }
  }, [isCreateChannelSuccess]);

  const handleCreateChannel = () => {
    const onCreateChannel = data => {
      const createChannelData = {
        ...data,
        roomId: currentRoom?.id,
      };
      console.log(createChannelData);
      dispatch(actions.createChannel(createChannelData));
    };
    dialog.setDialog({
      title: 'Create Channel',
      content: <CreateChannelDialog onClose={onCreateChannel} />,
      onClose: dialog.setDialog(null),
    });
  };

  const isAddedSuccess = useSelector(
    (state: RootState) => state.room?.isInviteUserSuccess,
  );

  useEffect(() => {
    if (isAddedSuccess) {
      toast({
        title: 'New member added to room',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearInviteUserToRoom());
    }
  }, [isAddedSuccess]);

  useEffect(() => {
    if (isLeaveRoomSuccess) {
      toast({
        title: 'Leave room success',
        status: 'success',
        duration: 2000,
      });
      history.push('/rooms');
      dispatch(actions.clearLeaveRoom());
    }
  }, [isLeaveRoomSuccess]);

  const handleAddMember = () => {
    const onAddMember = userId => {
      const data = {
        userIds: [userId],
        roomId: currentRoom.id,
      };
      console.log(data);
      dispatch(actions.inviteUserToRoom(data));
    };

    dialog.setDialog({
      title: 'Add member',
      content: <AddMemberDialog onClose={onAddMember} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };

  const handleAddEvent = () => {
    const onAddEvent = event => {
      const data = {
        event: event,
        id: currentRoom.id,
      };
      console.log(data);
      dispatch(actions.createRoomEvent(data));
    };
    dialog.setDialog({
      title: 'Add Event',
      content: <AddEventForRoomDialog onClose={onAddEvent} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };

  const handleUpdateEvent = id => {
    const event = eventList.filter(event => Number(event.id) === Number(id));
    const onAddEvent = event => {
      const data = {
        event: event,
        id: currentRoom.id,
      };
      console.log(data);
      dispatch(actions.createRoomEvent(data));
    };
    dialog.setDialog({
      title: 'Add Event',
      content: <AddEventForRoomDialog initData={event} onClose={onAddEvent} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };

  const handleUpdateRoomInfo = () => {
    dialog.setDialog({
      title: 'Room Info',
      content: <UpdateRoomInfoDialog onClose={() => {}} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };

  const handleLeaveRoom = () => {
    const leaveRoom = () => {
      const data = {
        user_id: userInfo.id,
        id: currentRoom.id,
      };
      dispatch(actions.leaveRoom(data));
    };

    dialog.setDialog({
      title: 'Leave Room',
      content: <ConfirmLeaveRoom onClose={leaveRoom} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };

  const handleMember = () => {
    dialog.setDialog({
      title: 'Members',
      content: <MemberDialog onClose={() => {}} />,
      onClose: dialog.setDialog(null),
      size: '2xl',
    });
  };
  const menuList = [
    {
      title: 'Create Channel',
      func: handleCreateChannel,
      isHidden: !isAdmin,
    },
    {
      title: 'Room Info',
      func: handleUpdateRoomInfo,
      isHidden: !isAdmin,
    },
    {
      title: 'Create Event',
      func: handleAddEvent,
      isHidden: !isAdmin,
    },
    {
      title: 'Add Member',
      func: handleAddMember,
      isHidden: !isAdmin,
    },
    {
      title: 'Members',
      func: handleMember,
    },
    {
      title: 'Leave Room',
      func: handleLeaveRoom,
      color: 'red.500',
    },
  ];

  return (
    <Box flex={0} w={250} bgColor="white" h="full" shadow="md">
      <Box
        w={250}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid "
        borderColor="gray.200"
        px={4}
        pt={3}
        pb={2}
      >
        <Text fontWeight={500} fontSize="md">
          {currentRoom?.name}
        </Text>
        <Menu placement="bottom-end" arrowPadding={12}>
          <MenuButton aria-label="Classroom options">
            <Icon as={Settings} />
          </MenuButton>
          <MenuList>
            {menuList.map(item =>
              !item.isHidden ? (
                <MenuItem
                  key={item.title}
                  onClick={item.func}
                  color={item.color}
                >
                  {item.title}
                </MenuItem>
              ) : (
                ''
              ),
            )}
          </MenuList>
        </Menu>
      </Box>
      <Box px={2}>
        <Accordion allowToggle allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Event
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {eventList?.length > 0 ? (
                eventList?.map(event => (
                  <Box key={event.id}>
                    <Box
                      p={2}
                      _hover={{ backgroundColor: 'gray.200' }}
                      borderRadius={5}
                      display="flex"
                      alignItems="center"
                      cursor="pointer"
                      onClick={() => handleUpdateEvent(event.id)}
                    >
                      <Icon as={Event} color="gray.500" mr={2} />
                      <Text>{event.title}</Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Text>There is no event.</Text>
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Channel
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              {channelList?.map(channel => (
                <Box key={channel.id}>
                  <Link to={`/rooms/${currentRoom?.id}/${channel.id}`}>
                    <Box
                      p={2}
                      _hover={{ backgroundColor: 'gray.200' }}
                      borderRadius={5}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon
                        as={channelTypeIcon[channel.type]}
                        color="gray.500"
                        mr={2}
                      />
                      <Text>{channel.name}</Text>
                    </Box>
                  </Link>
                  {channel.userActiveInChannel && (
                    <Box ml={5}>
                      {channel.userActiveInChannel?.map(user => (
                        <Box
                          key={user.id}
                          display="flex"
                          alignItems="center"
                          py={1}
                          width={210}
                        >
                          <Icon
                            as={FiberManualRecord}
                            boxSize={3}
                            color="green.300"
                            mr={3}
                          />
                          <Text
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                          >
                            {user.email}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

const ConfirmLeaveRoom = ({ onClose }) => {
  const { setDialog } = useDialog();

  return (
    <Box display="flex" flexDir="column">
      <Text mb={7}>
        After leave you can not read or send message in this room anymore. Are
        you sure to leave?{' '}
      </Text>
      <Box alignSelf="end">
        <Button
          mr={3}
          onClick={() => {
            setDialog(null);
          }}
          // colorScheme=""
        >
          Cancel
        </Button>
        <Button
          mr={3}
          onClick={() => {
            onClose();
            setDialog(null);
          }}
          colorScheme="red"
        >
          Leave
        </Button>
      </Box>
    </Box>
  );
};

export default ChannelSideMenu;
