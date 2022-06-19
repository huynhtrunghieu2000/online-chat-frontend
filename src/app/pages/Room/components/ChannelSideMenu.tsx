import {
  Box,
  IconButton,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  Button,
  useToast,
  Avatar,
} from '@chakra-ui/react';
import {
  Settings,
  FiberManualRecord,
  Videocam,
  Abc,
  MoreVert,
} from '@mui/icons-material';
import { useDialog } from 'app/components/Dialog/Dialog';
import { Channel } from 'app/core/models/Room';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { RootState } from 'types';
import { useRoomSlice } from '../slice';
import { useAuthSliceSlice } from 'app/pages/Auth/slice';
import AvatarUpload from 'app/components/AvatarUpload';

import _ from 'lodash';

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
        <Menu>
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
      </Box>
    </Box>
  );
};

const CreateChannelDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('text');
  const { setDialog } = useDialog();

  return (
    <Box display="flex" flexDir="column">
      <Input value={name} onChange={e => setName(e.target.value)} mb={2} />
      <Select value={type} onChange={e => setType(e.target.value)} mb={4}>
        <option value="text">Text</option>
        <option value="video">Video</option>
      </Select>
      <Box alignSelf="end">
        <Button
          mr={3}
          color="primary"
          onClick={() => {
            onClose({ name, type });
            setDialog(null);
          }}
        >
          Create
        </Button>
        <Button
          onClick={() => {
            setDialog(null);
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

const UpdateRoomInfoDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const { setDialog } = useDialog();
  const dispatch = useDispatch();
  const toast = useToast();
  const { actions } = useRoomSlice();

  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isUpdateRoomDetailSuccess = useSelector(
    (state: RootState) => state.room?.isUpdateRoomDetailSuccess,
  );
  useEffect(() => {
    if (currentRoom) {
      setName(currentRoom.name);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (isUpdateRoomDetailSuccess) {
      toast({
        title: 'Update success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearUpdateRoomDetail());
    }
  }, [isUpdateRoomDetailSuccess]);

  const onUpdateRoomInfo = (data?: any) => {
    const updateData = {
      id: currentRoom.id,
      name,
      ...data,
    };
    dispatch(actions.updateRoomDetail(updateData));
  };
  return (
    <Box>
      <Box display="flex">
        <Box flex={3} pb={6}>
          <AvatarUpload
            name={currentRoom?.name}
            saveCallback={onUpdateRoomInfo}
            initAvatar={currentRoom.avatar}
          />
        </Box>
        <Box flex={7}>
          <Text fontWeight="bold" mb={1}>
            Room name:
          </Text>
          <Input value={name} onChange={e => setName(e.target.value)} mb={2} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={8}>
        <Button mr={3} onClick={() => onUpdateRoomInfo()} colorScheme="purple">
          Save
        </Button>
        <Button
          mr={3}
          onClick={() => {
            setDialog(null);
          }}
          colorScheme="orange"
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

const AddMemberDialog = ({ onClose }) => {
  const { setDialog } = useDialog();
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const userList = useSelector(
    (state: RootState) => state.authSlice?.data?.userList,
  );
  const [search, setSearch] = React.useState('');
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);

  const onSearch = keyword => {
    dispatch(actions.searchUser(keyword));
  };

  return (
    <Box display="flex" flexDir="column">
      <Box display="flex">
        <Input
          flex={1}
          value={search}
          onChange={e => setSearch(e.target.value)}
          mb={2}
          mr={2}
        />
        <Button
          mr={3}
          color="primary"
          onClick={() => {
            onSearch({ search });
          }}
        >
          Search
        </Button>
      </Box>
      <Box my={4}>
        {userList?.map(user => (
          <Box
            key={user.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
            p={3}
            borderRadius={4}
            _hover={{
              backgroundColor: 'gray.200',
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar src={user.avatar} name={user.email} size="sm" mr={3} />
              {user.email}
            </Box>
            {!currentRoom?.Users.map(user => user.id).includes(user.id) ? (
              <Button onClick={() => onClose(user.id)} colorScheme="purple">
                Add +
              </Button>
            ) : (
              <Text color="purple.500" size="sm">
                Already member
              </Text>
            )}
          </Box>
        ))}
      </Box>
      <Box alignSelf="end">
        <Button
          mr={3}
          onClick={() => {
            setDialog(null);
          }}
          colorScheme="orange"
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

const MemberDialog = ({ onClose }) => {
  const { setDialog } = useDialog();
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const userList = useSelector(
    (state: RootState) => state.authSlice?.data?.userList,
  );
  const [search, setSearch] = React.useState('');
  const userInfo = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isRemoveMemberSuccess = useSelector(
    (state: RootState) => state.room?.isRemoveMemberSuccess,
  );
  const isUpdateRoleMemberSuccess = useSelector(
    (state: RootState) => state.room?.isUpdateRoleMemberSuccess,
  );

  useEffect(() => {
    if (isRemoveMemberSuccess) {
      toast({
        title: 'Member removed',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearRemoveMember());
    }
  }, [isRemoveMemberSuccess]);

  useEffect(() => {
    if (isUpdateRoleMemberSuccess) {
      toast({
        title: 'Change role success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearUpdateRoleMember());
    }
  }, [isUpdateRoleMemberSuccess]);

  const role = {
    owner: 'Admin',
    member: 'Member',
  };
  const isAdmin = currentRoom?.Users?.filter(
    user => userInfo?.id === user.id && user.ClassroomMember.role === 'owner',
  ).length;

  const handleSetRole = (role, id) => {
    const data = {
      user_id: id,
      id: currentRoom.id,
      role,
    };
    dispatch(actions.updateRoleMember(data));
  };
  const handleRemove = id => {
    const data = {
      user_id: id,
      id: currentRoom.id,
    };
    dispatch(actions.removeMember(data));
  };

  const menuList = id => [
    {
      title: 'Set to Admin',
      func: () => handleSetRole('owner', id),
    },
    {
      title: 'Set to Member',
      func: () => handleSetRole('member', id),
    },
    {
      title: 'Remove Member',
      func: () => handleRemove(id),
      color: 'red.500',
    },
  ];

  return (
    <Box display="flex" flexDir="column">
      <Text mb={3}>Members in this room:</Text>
      <Box display="flex" flexDir="column" maxHeight={300} overflow="scroll">
        {currentRoom?.Users?.map(user => (
          <Box
            key={user.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
            px={3}
            py={1}
            borderRadius={4}
            _hover={{
              backgroundColor: 'gray.200',
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar src={user?.avatar} name={user?.email} size="sm" mr={3} />
              <Box display="flex" flexDir="column">
                <Text>
                  {user?.email}
                  {user.id === userInfo.id && ' (you)'}
                </Text>
                <Text color="purple.500" fontSize={14}>
                  {role[user.ClassroomMember?.role]}
                </Text>
              </Box>
            </Box>
            {user.id !== userInfo.id && isAdmin ? (
              <Menu>
                <MenuButton aria-label="Classroom options">
                  <Icon as={MoreVert} color="gray.500" />
                </MenuButton>
                <MenuList>
                  {menuList(user.id).map(item => (
                    <MenuItem
                      key={item.title}
                      onClick={item.func}
                      color={item.color}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              ''
            )}
          </Box>
        ))}
      </Box>
      <Box alignSelf="end" mt={5}>
        <Button
          mr={3}
          onClick={() => {
            setDialog(null);
          }}
          colorScheme="orange"
        >
          Close
        </Button>
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
