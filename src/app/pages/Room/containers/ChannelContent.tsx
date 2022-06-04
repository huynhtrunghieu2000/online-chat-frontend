import { Box, Spinner, Text } from '@chakra-ui/react';
import MeetRoom from 'app/pages/Room/components/channel-video/MeetRoom';
import MessageBox from 'app/components/MessageBox';
import MessageEditor from 'app/components/MessageEditor';
import { useSocket } from 'app/core/contexts/socket';
import { CHANNEL_TYPE } from 'app/core/models/Room';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'types';
import PrejoinSection from '../components/channel-video/PrejoinSection';
import ChannelText from '../components/ChannelText';
import { useRoomSlice } from '../slice';

const ChannelContent = () => {
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const { idChannel } = useParams() as { idChannel: string };

  const messages =
    useSelector((state: RootState) => state.room?.messages) || [];
  const channelDetail = useSelector(
    (state: RootState) => state.room?.channelDetail,
  );
  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  useEffect(() => {
    dispatch(actions.getChannelDetail({ idChannel }));
  }, [idChannel]);

  const handleSubmitMessage = (message: string) => {
    const data = {
      message,
      idChannel,
      User: { ...userData },
    };
    dispatch(actions.sendMessageChannel(data));
  };

  return (
    <Box w="full" h="full">
      {channelDetail?.type === CHANNEL_TYPE.TEXT && (
        <ChannelText
          message={messages}
          handleSubmitMessage={handleSubmitMessage}
        />
      )}
      {channelDetail?.type === CHANNEL_TYPE.VIDEO && (
        // <PrejoinSection channel={channelDetail} />
        <MeetRoom roomId={idChannel} />
      )}
    </Box>
  );
};

export default ChannelContent;
