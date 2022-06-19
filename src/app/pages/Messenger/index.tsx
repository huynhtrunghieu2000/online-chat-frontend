/**
 *
 * Messenger
 *
 */
import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MessengerContent from './components/MessengerContent';
import MessengerSideBar from './components/MessengerSideBar';
import { messages } from './messages';

interface Props {}

const Messenger = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Box display="flex" height="full">
      <MessengerSideBar />
      <MessengerContent />
    </Box>
  );
};

export default Messenger;
