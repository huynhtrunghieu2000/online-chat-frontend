import {
  Avatar,
  Box,
  Button,
  Input,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useDialog } from 'app/components/Dialog/Dialog';
import { useAuthSliceSlice } from 'app/pages/Auth/slice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useRoomSlice } from '../../slice';

const AddMemberDialog = ({ onClose }) => {
  const { setDialog } = useDialog();
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const roomActions = useRoomSlice().actions;

  const userList = useSelector(
    (state: RootState) => state.authSlice?.data?.userList,
  );
  const [search, setSearch] = React.useState('');
  const isLoadingUserList = useSelector(
    (state: RootState) => state.authSlice?.isLoading,
  );
  const isLoadingRoomDetail = useSelector(
    (state: RootState) => state.room?.isLoading,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);

  const onSearch = keyword => {
    dispatch(actions.searchUser(keyword));
  };

  const onUpdateRoomPrivateStatus = isPublic => {
    if (currentRoom.is_private === isPublic) {
      const data = {
        id: currentRoom.id,
        is_private: !isPublic,
      };
      dispatch(roomActions.updateRoomDetail(data));
    }
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
      <Box my={4} maxH={300} overflowY="scroll">
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
      <Box mb={3} display="flex" alignItems="center">
        <Switch
          size="lg"
          isChecked={!currentRoom.is_private}
          mr={2}
          onChange={e => onUpdateRoomPrivateStatus(e.target.checked)}
        />
        Public room so anyone can join with link
      </Box>
      {!currentRoom.is_private && (
        <Box
          backgroundColor="purple.100"
          borderRadius={4}
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text fontSize="sm">Anyone can join room with link: </Text>
            <Text
              fontSize="sm"
              textDecoration="underline"
              cursor="pointer"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://localhost:3000/invite/${currentRoom.code}`,
                )
              }
            >
              https://localhost:3000/invite/{currentRoom.code}
            </Text>
          </Box>
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://localhost:3000/invite/${currentRoom.code}`,
              )
            }
          >
            Copy link
          </Button>
        </Box>
      )}

      <Box alignSelf="end" mt={5}>
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

export default AddMemberDialog;
