import { Box, Avatar, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {
  messageList: any[];
  avatarSize: 'xs' | 'xl' | 'sm' | 'md' | 'lg' | 'full' | '2xs' | '2xl';
  channelType: 'video' | 'text';
}

const MessageBox = memo(({ messageList, avatarSize, channelType }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Box flex={1} width="full">
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
              size={avatarSize}
            />
            <Box ml={avatarSize === 'sm' ? 2 : 5}>
              <Box display="flex" alignItems="baseline">
                <Text
                  maxWidth={channelType === 'video' ? '50%' : ''}
                  lineHeight="none"
                  pb={2}
                  mr={3}
                  fontWeight={500}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {message.User.name || message.User.email}
                </Text>
                <Text fontSize="sm" lineHeight="none" color="gray.500">
                  {moment(message.createdAt).format(
                    channelType === 'text' ? 'HH:mm | MMM DD, YYYY' : 'HH:mm',
                  )}
                </Text>
              </Box>
              <Text width={channelType === 'video' ? '210px' : 'full'}>
                {message.message}
              </Text>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
});

export default MessageBox;
