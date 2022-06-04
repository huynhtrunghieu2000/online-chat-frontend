import { Avatar, Box } from '@chakra-ui/react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {}

const VideoClientMeet = memo((props: any) => {
  const remoteVideo: any = React.useRef();
  React.useEffect(() => {
    // if (remoteVideo.current.srcObject) {
    //     remoteVideo.current.srcObject.addTrack(props.track);
    //         return;
    //     }
    console.log('CreateRemoteVideos');
    console.log(props);
    //  ( props.peer.stream as MediaStream).
    props
      .playVideo(remoteVideo.current, props.peer.stream)
      ?.then(() => {
        remoteVideo.current.volume = 1;
        console.log('remoteVideo.current');
        console.log(remoteVideo.current);
      })
      .catch((err: any) => {
        console.error('media ERROR:', err);
      });
  }, [props]);
  const videoDimensionByParticipants = number => {
    if (number <= 2) {
      return {
        width: '100%',
        height: '100%',
      };
    }
    if (number <= 4) {
      return {
        width: '50%',
        height: '50%',
      };
    }
    if (number <= 9) {
      return {
        width: '33%',
        height: '33%',
      };
    }
    return {
      width: '25%',
      height: '25%',
    };
  };

  return (
    <Box
      sx={{
        '& > video': {
          width: '100%',
          height: '100%',
          border: 'transparent',
          objectFit: 'contain',
        },
      }}
      flex="1 1 auto"
      width={videoDimensionByParticipants(props.numberParticipants).width}
      height={videoDimensionByParticipants(props.numberParticipants).height}
      minWidth="25%"
      maxWidth="100%"
      maxHeight="80%"
      border="5px solid"
      borderColor="purple.500"
      backgroundColor="gray.100"
      borderRadius="5px"
    >
      <video ref={remoteVideo} autoPlay controls={false} />
      <Avatar
        name={'localUserInfo?.email'}
        size={props.numberParticipants === 1 ? '2xl' : 'md'}
      />
    </Box>
  );
});

export default VideoClientMeet;
