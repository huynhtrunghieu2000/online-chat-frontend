import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AspectRatio, Avatar, Box, IconButton, Text } from '@chakra-ui/react';
import {
  CallEnd,
  Camera,
  Chat,
  Mic,
  MicOff,
  PersonAdd,
  ScreenShare,
  Settings,
  StopScreenShare,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';
import VideoClientMeet from 'app/components/VideoClientMeet';
import { RootState } from 'types';
import { useRoomSlice } from '../../slice';
import ChatBox from './ChatBox';
import AudioSpectrum from 'react-audio-spectrum';
import {
  SpectrumVisualizer,
  SpectrumVisualizerTheme,
} from 'react-audio-visualizers';

const CallingSection = ({
  localVideoStream,
  isOnCam,
  isOnMic,
  handleToggleCamera,
  handleToggleMic,
  localScreenStream,
  isShareScreen,
  handleStartScreenShare,
  handleStopScreenShare,
  remoteVideos,
  playVideo,
  handleEndCall,
  sendMsgCallBack,
  messageList,
  isConnected,
  isStartStream,
}) => {
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  // const ctx = new AudioContext();

  const localVideo: any = useRef();
  // const localAudio: any = new Audio();
  // const localAudioElement = new Audio();
  // const sourceAudio: any = useRef();
  const localScreen: any = useRef();
  const [numberParticipants, setNumberParticipants] = useState(1);
  const [isOpenMsgBox, setIsOpenMsgBox] = useState(false);

  const channelDetail = useSelector(
    (state: RootState) => state.room?.channelDetail,
  );

  const localUserInfo = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );

  useEffect(() => {
    dispatch(actions.currentMeetingChanged(channelDetail.id));
    return () => {
      dispatch(actions.currentMeetingChanged(null));
      if (isConnected) {
        isShareScreen && onStopScreenShare();
        isStartStream && onStopUserVideo();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numberRemote = Object.keys(remoteVideos).reduce(
    (prev, curr) => prev + Object.keys(remoteVideos[curr]).length,
    0,
  );
  useEffect(() => {
    const numberLocal = 1;
    const numberLocalScreen = localScreenStream.current ? 1 : 0;
    setNumberParticipants(numberRemote + numberLocal + numberLocalScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberRemote, localScreenStream.current]);

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

  useEffect(() => {
    if (localVideoStream.current) {
      playVideo(localVideo.current, localVideoStream.current);
      // ?.then(() => {
      //   if (!sourceAudio.current) {
      //     sourceAudio.current = ctx.createMediaStreamSource(
      //       localVideoStream.current,
      //     );
      //     const streamDest = ctx.createMediaStreamDestination();
      //     sourceAudio.current.connect(streamDest);
      //     localAudioElement.srcObject = streamDest.stream;
      //     // localAudioElement.volume = 1;
      //     localAudioElement.play();
      //   }
      // })
      // .catch((err: any) => {
      //   console.error('media ERROR:', err);
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVideoStream.current]);

  useEffect(() => {
    console.log('localScreenStream', localScreenStream.current);
    playVideo(localScreen.current, localScreenStream.current);
    if (localScreenStream.current === null)
      localScreen.current.srcObject = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localScreenStream.current, isShareScreen]);

  function pauseVideo(element: any) {
    if (!element) return;
    element.pause();
    element.srcObject = null;
  }

  const onStopUserVideo = () => {
    pauseVideo(localVideo.current);
  };
  const onStopScreenShare = () => {
    pauseVideo(localScreen.current);
  };

  return (
    <>
      <ChatBox
        isOpen={isOpenMsgBox}
        messageList={messageList}
        sendMessage={sendMsgCallBack}
      />
      <Box
        position="relative"
        height="full"
        width="full"
        _after={{
          content: '""',
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 25%)',
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          height="full"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              '& > video': {
                width: '100%',
                height: '100%',
                border: 'transparent',
                objectFit: 'contain',
              },
            }}
            // flex="1 1 auto"
            width={videoDimensionByParticipants(numberParticipants).width}
            height={videoDimensionByParticipants(numberParticipants).height}
            minWidth="25%"
            maxWidth="100%"
            maxHeight="80%"
            borderRadius="5px"
            backgroundColor="gray.400"
            hidden={!isShareScreen}
            pos="relative"
          >
            <video ref={localScreen} autoPlay />
            <Box
              position="absolute"
              top="2"
              left="2"
              p="1"
              backgroundColor="whiteAlpha.700"
              borderRadius="5px"
              // display="flex"
            >
              <Text mr={1}>{localUserInfo?.email}</Text>
            </Box>
          </Box>
          {Object.keys(remoteVideos).map((key: any, index: number) => {
            return Object.keys(remoteVideos[key]).map(
              (key2: any, index2: number) => {
                const peer: any = remoteVideos[key][key2];
                console.log(
                  '🚀 ~ file: CallingSection.tsx ~ line 169 ~ {Object.keys ~ peer',
                  peer,
                );
                return (
                  <VideoClientMeet
                    key={peer.socket_id + '__' + key2}
                    isLocalStream={false}
                    numberParticipant={numberParticipants}
                    peer={peer}
                    playVideo={playVideo}
                  />
                );
              },
            );
          })}
        </Box>
        <Box
          sx={{
            '& > video': {
              width: numberParticipants === 1 ? '100%' : '330px',
              height: numberParticipants === 1 ? '100%' : '200px',
              border: 'transparent',
              objectFit: 'cover',
            },
          }}
          borderRadius="5px"
          position="absolute"
          width={numberParticipants === 1 ? '100%' : '330px'}
          height={numberParticipants === 1 ? '100%' : '200px'}
          bottom={numberParticipants === 1 ? '0' : '3'}
          right={numberParticipants === 1 ? '0' : '2'}
          boxShadow="inner"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="gray.400"
        >
          <video ref={localVideo} hidden={!isOnCam} />
          <Avatar
            name={localUserInfo?.email}
            hidden={isOnCam}
            size={numberParticipants === 1 ? '2xl' : 'md'}
          />
          <Box
            position="absolute"
            top="2"
            left="2"
            p="1"
            backgroundColor="whiteAlpha.700"
            borderRadius="5px"
            // display="flex"
          >
            <Text mr={1}>{localUserInfo?.email}</Text>
          </Box>
        </Box>
        {/* TOP BAR ACTION */}
        <Box
          pos="absolute"
          top="0"
          width="full"
          display="flex"
          justifyContent="flex-end"
          paddingX={6}
          paddingY={6}
          sx={{
            '& button': {
              color: 'purple.500',
            },
          }}
          zIndex={1}
          background="linear-gradient(to bottom, rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%)"
        >
          <IconButton aria-label="chat" icon={<PersonAdd fontSize="small" />} />
        </Box>
        {/* BOTTOM ACTION */}
        <Box
          pos="absolute"
          bottom="0"
          width="full"
          display="flex"
          justifyContent="space-between"
          paddingX={6}
          paddingY={6}
          sx={{
            '& button': {
              color: 'purple.500',
              backgroundColor: 'gray.100',
              '&.active': {
                color: 'gray.100',
                backgroundColor: 'purple.500',
              },
            },
          }}
          zIndex={10}
          background="linear-gradient(to top, rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%)"
        >
          <IconButton
            aria-label="chat"
            icon={<Chat fontSize="small" />}
            onClick={() => setIsOpenMsgBox(!isOpenMsgBox)}
          />
          <Box>
            <IconButton
              aria-label="chat"
              icon={
                isOnMic ? <MicOff fontSize="small" /> : <Mic fontSize="small" />
              }
              className={isOnMic ? 'active' : ''}
              onClick={handleToggleMic}
            />
            <IconButton
              mx={3}
              aria-label="chat"
              className={isOnCam ? 'active' : ''}
              icon={
                isOnCam ? (
                  <VideocamOff fontSize="small" />
                ) : (
                  <Videocam fontSize="small" />
                )
              }
              onClick={handleToggleCamera}
            />
            <IconButton
              aria-label="chat"
              className={isShareScreen ? 'active' : ''}
              icon={
                isShareScreen ? (
                  <StopScreenShare fontSize="small" />
                ) : (
                  <ScreenShare fontSize="small" />
                )
              }
              onClick={
                isShareScreen ? handleStopScreenShare : handleStartScreenShare
              }
            />
            <IconButton
              ml={3}
              aria-label="chat"
              icon={<CallEnd fontSize="small" color="inherit" />}
              className="active"
              onClick={() => {
                handleEndCall();
                // onStopUserVideo();
                // onStopScreenShare();
              }}
            />
          </Box>
          <IconButton aria-label="chat" icon={<Settings fontSize="small" />} />
        </Box>
      </Box>
    </>
  );
};

export default CallingSection;
