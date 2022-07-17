import { Box, Avatar, Text, Image } from '@chakra-ui/react';
import moment from 'moment';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import AttachmentComponent from './AttachmentComponent';
import Username from '../Username';

interface Props {
  messageList: any[];
  avatarSize: 'xs' | 'xl' | 'sm' | 'md' | 'lg' | 'full' | '2xs' | '2xl';
  channelType: 'video' | 'text';
}

const MessageBox = memo(({ messageList, avatarSize, channelType }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const messageEnd = useRef<HTMLDivElement>(null);
  const box = useRef<any>(null);
  const scrollToBottom = () => {
    if (messageEnd.current) messageEnd.current.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <Box flex={1} width="full" height="full" overflowY="scroll" ref={box}>
      {messageList.map((message, index) => (
        <Box
          key={index}
          px={5}
          py={3}
          w="full"
          borderBottomColor="gray.200"
          borderBottomWidth={1}
          _hover={{
            backgroundColor: 'gray.300',
            transition: 'all 0.2s',
          }}
          borderRadius={4}
        >
          <Box display="flex">
            <Avatar
              src={message?.User?.avatar}
              name={message.User.email}
              size={avatarSize}
            />
            <Box ml={avatarSize === 'sm' ? 2 : 5}>
              <Box display="flex" alignItems="baseline">
                <Box pb={2} mr={3}>
                  <Username user={message.User} />
                </Box>
                <Text fontSize="sm" lineHeight="none" color="gray.500">
                  {moment(message.createdAt).format(
                    channelType === 'text' ? 'HH:mm | MMM DD, YYYY' : 'HH:mm',
                  )}
                </Text>
              </Box>
              <Text width={channelType === 'video' ? '210px' : 'full'}>
                {message.message}
              </Text>
              {message?.attachments?.length > 0
                ? message?.attachments?.map(attachment => (
                    <AttachmentComponent
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))
                : ''}
            </Box>
          </Box>
        </Box>
      ))}
      <Box ref={messageEnd}></Box>
    </Box>
  );
});

export default MessageBox;
