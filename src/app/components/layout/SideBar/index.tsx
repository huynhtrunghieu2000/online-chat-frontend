/**
 *
 * SideBar
 *
 */
import { Box } from '@chakra-ui/react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {}

export const SideBar = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const listOptions = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Users',
      path: '/users',
    },
  ];
  return (
    <Box w="md" h="full" display="flex" flexDirection="column" shadow="md">
      {listOptions.map(option => (
        <Box key={option.name}>{option.name}</Box>
      ))}
    </Box>
  );
});
