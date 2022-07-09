import {
  Avatar,
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import { MoreVert } from '@mui/icons-material';
import { useDialog } from 'app/components/Dialog/Dialog';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useRoomSlice } from '../../slice';

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
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://localhost:3000/invite/${currentRoom.code}`,
                );
                toast({ status: 'success', title: 'Copied' });
              }}
            >
              https://localhost:3000/invite/{currentRoom.code}
            </Text>
          </Box>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://localhost:3000/invite/${currentRoom.code}`,
              );
              toast({ status: 'success', title: 'Copied' });
            }}
          >
            Copy link
          </Button>
        </Box>
      )}
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

export default MemberDialog;
