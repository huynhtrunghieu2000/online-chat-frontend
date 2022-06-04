import { Avatar, Box, Button, Switch } from '@chakra-ui/react';
import VideoPlayerCall from 'app/components/VideoPlayerCall';
import { useMediaSoup } from 'app/core/contexts/mediasoup';
import { SocketClient } from 'app/core/contexts/socket-client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

const PrejoinSection = ({ channel }) => {
  const mediaSoupClient = useCallback(useMediaSoup, []);
  const { getLocalVideoStream, streamSuccess, joinRoom, getListVideoStream } =
    mediaSoupClient();

  const localVideo = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const userData = useSelector(
    (state: RootState) => state.authSlice?.data.user,
  );
  const currentMeeting = useSelector(
    (state: RootState) => state.room?.currentMeeting,
  );
  console.log(currentMeeting);
  let localVideoStream: MediaStream;
  const getStream = (withVideo, withAudio) => {
    return navigator.mediaDevices.getUserMedia({
      audio: withAudio,
      video: withVideo
        ? {
            width: {
              min: 640,
              max: 1920,
            },
            height: {
              min: 400,
              max: 1080,
            },
          }
        : false,
    });
  };
  useEffect(() => {
    return () => {
      if (localVideoStream) {
        localVideoStream?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    console.log(getListVideoStream());
  }, [currentMeeting]);

  useEffect(() => {
    if (isCameraOn || isAudioOn) {
      if (localVideoStream) {
        localVideoStream.getTracks().forEach(track => track.stop());
      }
      getStream(isCameraOn, isAudioOn)
        .then((stream: MediaStream) => {
          localVideoStream = stream;
          localVideo.current!.srcObject = localVideoStream;
          streamSuccess(stream);
          console.log('localll', stream);
        })
        .catch(error => {
          console.log(error.message);
        });
    } else {
      if (localVideoStream) {
        localVideoStream?.getTracks().forEach(track => track.stop());
      }
    }
  }, [isCameraOn, isAudioOn]);

  return (
    <Box display="flex" justifyContent="center" pt={'32'}>
      <Box width={500}>
        <Box bgColor="white" height={375}>
          {isCameraOn ? (
            <video ref={localVideo} height={400} autoPlay={true} muted />
          ) : (
            <Box
              height={400}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar size="2xl" name={userData.email} />
            </Box>
          )}
        </Box>
        <Box
          bgColor={'gray.700'}
          color="white"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={4}
        >
          <Switch
            isChecked={isCameraOn}
            onChange={e => setIsCameraOn(!isCameraOn)}
          />
          Video
          <Switch
            ml={3}
            isChecked={isAudioOn}
            onChange={e => setIsAudioOn(!isAudioOn)}
          />
          Audio
        </Box>
        <Button
          colorScheme="purple"
          isFullWidth
          mt={2}
          onClick={() => joinRoom(channel.id)}
        >
          Join
        </Button>
      </Box>
    </Box>
  );
};

export default PrejoinSection;
