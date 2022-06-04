import { Box, Spinner } from '@chakra-ui/react';
import MessageBox from 'app/components/MessageBox';
import MessageEditor from 'app/components/MessageEditor';
import React, { useEffect, useRef } from 'react';

const ChannelText = ({ message, handleSubmitMessage }) => {
  const msgBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (msgBox.current) {
      msgBox.current.scrollTop = msgBox.current.scrollHeight;
    }
  }, [message]);
  return (
    <Box
      height={window.innerHeight - 70}
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <Box ref={msgBox} flex={1} overflowY="scroll">
        {message ? (
          <MessageBox messageList={message} />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        )}
      </Box>
      <Box height={90}>
        <MessageEditor onSubmit={handleSubmitMessage} />
      </Box>
    </Box>
  );
};

export default ChannelText;
