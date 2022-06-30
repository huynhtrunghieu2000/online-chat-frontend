import {
  Avatar,
  Box,
  Button,
  Center,
  CircularProgress,
  Text,
} from '@chakra-ui/react';
import { useRoomSlice } from 'app/pages/Room/slice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'types';

const JoinByInvite = () => {
  const params = useParams<any>();
  const { actions } = useRoomSlice();
  const dispatch = useDispatch();
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);

  useEffect(() => {
    console.log(params);
    dispatch(actions.getRoomByInviteCode(params));
  }, []);

  const onJoinNow = () => {
    dispatch(actions.joinRoomByInviteCode(params));
  };

  return (
    <Center height="full" width="full" backgroundColor="purple.100">
      <Box
        p={4}
        shadow="2xl"
        borderRadius={4}
        width={500}
        display="flex"
        flexDir="column"
        alignItems="center"
        transform="translateY(-25%)"
        backgroundColor="white"
      >
        {currentRoom?.id ? (
          <>
            <Box>
              <Text display="inline">You are invited to join</Text>
              &nbsp;
              <Text as="span" display="inline" fontWeight="bold">
                {currentRoom.name}
              </Text>
            </Box>
            <Avatar
              mt={4}
              mb={8}
              size="2xl"
              src={currentRoom.avatar}
              name={currentRoom.name}
            />
            <Button isFullWidth={true} colorScheme="purple" onClick={onJoinNow}>
              Join now
            </Button>
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Center>
  );
};

export default JoinByInvite;
