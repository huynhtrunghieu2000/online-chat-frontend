import { Box, Slide, Collapse, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MessageBox from 'app/components/MessageBox';
import MessageEditor from 'app/components/MessageEditor';

const ChatBox = ({ isOpen, sendMessage, messageList = [] }) => {
  console.log(
    '🚀 ~ file: ChatBox.tsx ~ line 8 ~ ChatBox ~ messageList',
    messageList,
  );

  const [hidden, setHidden] = useState(!isOpen);
  return (
    <motion.div
      hidden={hidden}
      initial={false}
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => setHidden(!isOpen)}
      animate={{ width: isOpen ? 400 : 0 }}
      style={{
        background: 'white',
        overflow: 'hidden',
        // whiteSpace: 'nowrap',
        left: '0',
        height: '100vh',
        top: '0',
      }}
    >
      <Box height="full">
        <Text
          fontSize="lg"
          fontWeight="bold"
          p={3}
          pt={4}
          borderBottomColor="gray.100"
          borderBottomWidth={1}
        >
          Messages
        </Text>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(100% - 125px)"
          p={2}
        >
          <MessageBox
            messageList={messageList}
            avatarSize="sm"
            channelType="video"
          />
          <MessageEditor onSubmit={sendMessage} isOnlyText={true} />
        </Box>
      </Box>
    </motion.div>
  );
};

export default ChatBox;
