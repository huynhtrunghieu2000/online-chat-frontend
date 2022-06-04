import { Box, Avatar, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {
  messageList: any[];
}

const MessageBox = memo(({ messageList }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Box flex={1}>
      {messageList.map((message, index) => (
        <Box
          key={index}
          px={5}
          py={3}
          w="full"
          borderBottomColor="gray.200"
          borderBottomWidth={1}
        >
          <Box display="flex">
            <Avatar
              src={message?.User?.avatar}
              name={message.User.email}
              size="md"
            />
            <Box ml={5}>
              <Box display="flex" alignItems="baseline">
                <Text lineHeight="none" pb={2} mr={3} fontWeight={500}>
                  {message.User.name || message.User.email}
                </Text>
                <Text fontSize="sm" lineHeight="none" color="gray.500">
                  {moment(message.createdAt).fromNow()}
                </Text>
              </Box>
              {message.message}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
});

export default MessageBox;
