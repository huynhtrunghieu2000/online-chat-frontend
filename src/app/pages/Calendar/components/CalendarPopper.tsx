import { Box, Icon, Text } from '@chakra-ui/react';
import { LocationOn, MeetingRoom } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';

const CalendarPopper = (fields, event) => {
  const isLocationChannel = String(event.location) !== event.location;
  const eventLocation = event.location;

  const eventLocationName = !isLocationChannel
    ? eventLocation
    : eventLocation?.channel?.name;
  const linkLocation = !isLocationChannel
    ? null
    : `/rooms/${eventLocation?.room?.id}/${eventLocation?.channel?.id}`;

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Icon
          as={LocationOn}
          mr={1.5}
          boxSize="22px"
          ml={0.5}
          color="rgba(0, 0, 0, 0.6)"
        />
        {eventLocation &&
          (linkLocation ? (
            <Text
              fontSize="12px"
              as={Link}
              to={linkLocation}
              textDecor="underline"
              color="rgba(0, 0, 0, 0.6)"
            >
              {eventLocationName}
            </Text>
          ) : (
            <Text fontSize="12px" color="rgba(0, 0, 0, 0.6)">
              {eventLocationName}
            </Text>
          ))}
      </Box>
      {eventLocation?.room ? (
        <Box display="flex" alignItems="center">
          <Icon
            as={MeetingRoom}
            mr={1.5}
            boxSize="22px"
            ml={0.5}
            color="rgba(0, 0, 0, 0.6)"
          />
          <Text
            textDecor="underline"
            color="rgba(0, 0, 0, 0.6)"
            fontSize="12px"
            as={Link}
            to={`rooms/${eventLocation.room.id}`}
          >
            {eventLocation.room.name}
          </Text>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
};

export default CalendarPopper;
