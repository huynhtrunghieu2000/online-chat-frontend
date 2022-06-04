/**
 *
 * Notification
 *
 */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { messages } from './messages';

interface Props {}

export const Notification = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const notificationConfig = {
    position: 'top-right',
    duration: 5000,
    isClosable: false,
  };

  return (
    <div>
      {t('')}
      {/*  {t(...messages.someThing())}  */}
    </div>
  );
});
