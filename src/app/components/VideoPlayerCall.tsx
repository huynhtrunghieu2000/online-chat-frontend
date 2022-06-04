import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

const VideoPlayerCall = ({ stream }) => {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(stream.kind);
    if (stream.kind === 'video') {
      videoPlayer.current!.srcObject = stream.track;
      console.log(videoPlayer.current);
    } else {
      audioPlayer.current!.srcObject = stream.track;
      console.log(audioPlayer.current);
    }
  }, [stream]);

  return (
    <Box>
      {stream.kind === 'video' && (
        <video
          ref={videoPlayer}
          width={300}
          height={200}
          autoPlay
          playsInline
        />
      )}
      {stream.kind === 'audio' && (
        <audio ref={audioPlayer} autoPlay playsInline />
      )}
    </Box>
  );
};

export default VideoPlayerCall;
