import { Text } from '@chakra-ui/react';
import React from 'react';

const Username = ({ user, maxWidth = '100%' }) => {
  const getName = user => {
    const { first_name, last_name, email } = user;
    return first_name ? `${first_name} ${last_name}` : email;
  };
  return (
    <Text
      maxWidth={maxWidth}
      lineHeight="none"
      fontWeight={500}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {getName(user)}
    </Text>
  );
};

export default Username;
