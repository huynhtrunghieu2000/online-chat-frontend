import {
  Box,
  Button,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Abc, MoreVert, Videocam } from '@mui/icons-material';
import { useDialog } from 'app/components/Dialog/Dialog';
import MessageBox from 'app/components/MessageBox';
import MessageEditor from 'app/components/MessageEditor';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useRoomSlice } from '../slice';
import { useHistory } from 'react-router-dom';

const ChannelText = ({ message, handleSubmitMessage }) => {
  const dialog = useDialog();
  const toast = useToast();
  const msgBox = useRef<HTMLDivElement>(null);
  const channel = useSelector((state: RootState) => state.room?.channelDetail);
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const history = useHistory();

  const isUpdateChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isUpdateChannelSuccess,
  );
  const isRemoveChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isRemoveChannelSuccess,
  );

  const channelTypeIcon = {
    text: Abc,
    video: Videocam,
  };

  useEffect(() => {
    if (msgBox.current) {
      msgBox.current.scrollTop = msgBox.current.scrollHeight;
    }
  }, [message]);

  const handleChangeName = () => {
    const onChangeName = name => {
      const data = {
        id: channel?.id,
        name,
      };
      console.log(data);
      dispatch(actions.updateChannel(data));
    };

    dialog.setDialog({
      title: 'Change name',
      content: <UpdateChannelInfoDialog onClose={onChangeName} />,
      onClose: dialog.setDialog(null),
      // size: '2xl',
    });
  };

  const handleRemoveChannel = id => {
    const data = {
      id,
    };
    dispatch(actions.removeChannel(data));
  };
  const menuList = id => [
    {
      title: 'Change channel name',
      func: () => handleChangeName(),
    },
    {
      title: 'Remove channel',
      func: () => handleRemoveChannel(id),
      color: 'red.500',
    },
  ];

  useEffect(() => {
    if (isUpdateChannelSuccess) {
      toast({
        title: 'Update channel success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearUpdateChannel());
    }
  }, [isUpdateChannelSuccess]);

  useEffect(() => {
    if (isRemoveChannelSuccess) {
      console.log('removed')
      toast({
        title: 'Remove channel success',
        status: 'success',
        duration: 2000,
      });
      history.replace(`/rooms/${currentRoom.id}`);
      dispatch(actions.clearRemoveChannel());
    }
  }, [isRemoveChannelSuccess]);

  return channel ? (
    <Box
      height="full"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <Box
        width="100%"
        backgroundColor="white"
        p={3}
        display="flex"
        justifyContent="space-between"
      >
        <Box display="flex">
          <Icon as={channelTypeIcon[channel?.type]} color="gray.500" mr={2} />
          <Text fontWeight="bold">{channel?.name}</Text>
        </Box>
        <Menu>
          <MenuButton aria-label="Classroom options">
            <Icon as={MoreVert} color="gray.500" />
          </MenuButton>
          <MenuList>
            {menuList(channel?.id).map(item => (
              <MenuItem key={item.title} onClick={item.func} color={item.color}>
                {item.title}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <Box ref={msgBox} flex={1} overflowY="scroll">
        {message ? (
          <MessageBox
            messageList={message}
            avatarSize="md"
            channelType="text"
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        )}
      </Box>
      <Box p={5}>
        <MessageEditor onSubmit={handleSubmitMessage} />
      </Box>
    </Box>
  ) : (
    <Text>Loading...</Text>
  );
};

export const UpdateChannelInfoDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const { setDialog } = useDialog();

  const channel = useSelector((state: RootState) => state.room?.channelDetail);
  const [error, setError] = React.useState('');

  useEffect(() => {
    if (!name) {
      setError("Channel's name is required");
    } else if (name.length < 3) {
      setError('Name must be at least 3 characters');
    } else setError('');
  }, [name]);

  useEffect(() => {
    return () => {
      setName('');
      setError('');
    };
  }, []);

  useEffect(() => {
    if (channel) {
      setName(channel.name);
    }
  }, [channel]);

  return (
    <Box>
      <Box>
        <Text fontWeight="bold" mb={1}>
          Channel name:
        </Text>
        <Input value={name} onChange={e => setName(e.target.value)} mb={2} />
        <Text fontSize="smaller" color="red.500">{error}</Text>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={8}>
        <Button
          mr={3}
          onClick={() => {
            onClose(name);
            setDialog(null);
          }}
          disabled={!!error}
          colorScheme="purple"
        >
          Save
        </Button>
        <Button
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
export default ChannelText;
