import {
  Avatar,
  Box,
  Button,
  Center,
  CircularProgress,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRoomSlice } from 'app/pages/Room/slice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { RootState } from 'types';

const JoinByInvite = () => {
  const params = useParams<any>();
  const toast = useToast();
  const history = useHistory();
  const { actions } = useRoomSlice();
  const dispatch = useDispatch();
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isLoading = useSelector((state: RootState) => state.room?.isLoading);
  const error = useSelector((state: RootState) => state.room?.error);
  const isJoinRoomSuccess = useSelector(
    (state: RootState) => state.room?.isJoinRoomSuccess,
  );

  useEffect(() => {
    console.log(params);
    dispatch(actions.getRoomByInviteCode(params));

    return () => {
      dispatch(actions.clearJoinRoomByInviteCode());
    };
  }, []);

  useEffect(() => {
    if (isJoinRoomSuccess) {
      toast({
        status: 'success',
        title: 'Join room success.',
      });
      dispatch(actions.clearJoinRoomByInviteCode());
      history.push(`/rooms/${currentRoom.id}`);
    }
  }, [isJoinRoomSuccess]);

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        title: error.data.message || 'Something wrong',
        description: 'Check your invitation again',
      });
    }
  }, [error]);

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
            <Button
              isFullWidth={true}
              colorScheme="purple"
              onClick={onJoinNow}
              isLoading={isLoading}
            >
              Join now
            </Button>
          </>
        ) : error ? (
          error.data.message
        ) : (
          <CircularProgress />
        )}
        {error ? (
          <Button colorScheme="purple" onClick={() => history.push('/rooms')}>
            Back to rooms
          </Button>
        ) : (
          ''
        )}
      </Box>
    </Center>
  );
};

export default JoinByInvite;
