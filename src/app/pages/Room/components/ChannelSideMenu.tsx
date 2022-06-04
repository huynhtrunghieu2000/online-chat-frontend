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
} from '@chakra-ui/react';
import {
  Settings,
  FiberManualRecord,
  Videocam,
  Abc,
} from '@mui/icons-material';
import { useDialog } from 'app/components/Dialog/Dialog';
import { Channel } from 'app/core/models/Room';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'types';
import { useRoomSlice } from '../slice';

const ChannelSideMenu = () => {
  const dialog = useDialog();
  const { actions } = useRoomSlice();
  const dispatch = useDispatch();
  const toast = useToast();
  const channelTypeIcon = {
    text: Abc,
    video: Videocam,
  };

  const channelList = useSelector(
    (state: RootState) => state.room?.roomDetail?.Channels,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isCreateChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isCreateChannelSuccess,
  );

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
            <MenuItem onClick={handleCreateChannel}>Create Channel</MenuItem>
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

export default ChannelSideMenu;
