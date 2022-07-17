import {
  Avatar,
  Box,
  Icon,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import ChannelSideMenu from '../components/ChannelSideMenu';
import { MessageBox } from 'app/components/MessageBox/Loadable';
import MessageEditor from 'app/components/MessageEditor';
import { useSocket } from 'app/core/contexts/socket';
import { roomActions } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from 'app/core/modules/PrivateRoute';
import ChannelContent from './ChannelContent';
import { RootState } from 'types';
import { SocketClient } from 'app/core/contexts/socket-client';
import FriendList from '../components/FriendList';

const RoomContent = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { idRoom } = useParams() as { idRoom: string };
  const dispatch = useDispatch();
  const toast = useToast();

  const currentMeeting = useSelector(
    (state: RootState) => state.room?.currentMeeting,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const currentChannel = useSelector(
    (state: RootState) => state.room?.channelDetail,
  );

  const room = useSelector((state: RootState) => state.room);
  useEffect(() => {
    dispatch(roomActions.getRoomDetail({ id: idRoom }));
    const renewRoom = setInterval(() => {
      dispatch(roomActions.getRoomDetail({ id: idRoom }));
    }, 5000);
    return () => {
      clearInterval(renewRoom);
      dispatch(roomActions.clearGetRoomDetail());
      dispatch(roomActions.clearGetChannelDetail());
    };
  }, [idRoom]);

  useEffect(() => {
    if (!room?.roomDetail && room?.hasError && !room.isLoading) {
      toast({
        title: 'Error',
        description: room?.error?.message,
        status: 'error',
      });

      history.push('/' + room?.error?.status || '500');
    }
  }, [room]);

  return (
    <Box bgColor="gray.100" w="full" h="full" display="flex">
      {!currentMeeting && <ChannelSideMenu />}
      <PrivateRoute path={`${url}/:idChannel`} component={ChannelContent} />
      {!currentChannel && (
        <Box
          flex={1}
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Please choose a channel
        </Box>
      )}
      {!currentMeeting && <FriendList list={currentRoom?.Users} />}
    </Box>
  );
};

export default RoomContent;
