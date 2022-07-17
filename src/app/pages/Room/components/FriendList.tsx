import { Avatar, AvatarBadge, Box, Text } from '@chakra-ui/react';
import React from 'react';

const FriendList = ({ list }) => {
  return (
    <Box height="full" width={300} boxShadow="lg" justifySelf="flex-end">
      <Box p={3} boxShadow="sm">
        <Text fontWeight={600} fontSize="lg">
          Members
        </Text>
      </Box>
      <Box>
        {list?.map(item => (
          <Box
            key={item.id}
            px={3}
            py={2}
            display="flex"
            alignItems="center"
            borderRadius={4}
            gap={2}
            _hover={{
              backgroundColor: 'gray.300',
            }}
          >
            <Avatar
              src={item.avatar || undefined}
              name={item.first_name || undefined}
              size="sm"
            >
              {item.isOnline && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>
            <Text>
              {item.first_name
                ? `${item.first_name} ${item.last_name}`
                : item.email}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FriendList;
