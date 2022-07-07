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

const RoomContent = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { idRoom } = useParams() as { idRoom: string };
  const dispatch = useDispatch();
  const toast = useToast();

  const currentMeeting = useSelector(
    (state: RootState) => state.room?.currentMeeting,
  );

  const room = useSelector((state: RootState) => state.room);
  useEffect(() => {
    dispatch(roomActions.getRoomDetail({ id: idRoom }));
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
    </Box>
  );
};

export default RoomContent;
