import React, { ReactElement } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Box,
  Icon,
  Text,
  Button,
} from '@chakra-ui/react';
import { PopoverTrigger } from 'app/components/PopoverTrigger';
import { Event, LocationOn } from '@mui/icons-material';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

const EventInfoPopOver = ({ children, event, handleUpdate }) => {
  const history = useHistory();
  const isLocationChannel = String(event.location) !== event.location;
  const eventLocation = event.location;
  const userInfo = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isAdmin = currentRoom?.Users?.filter(
    user => userInfo?.id === user.id && user.ClassroomMember.role === 'owner',
  ).length;

  const eventLocationName = !isLocationChannel
    ? eventLocation
    : eventLocation?.channel?.name;
  const linkLocation = !isLocationChannel
    ? null
    : `/rooms/${eventLocation?.room?.id}/${eventLocation?.channel?.id}`;
  return (
    <Popover placement="bottom-end" colorScheme="purple">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent width={400}>
        <PopoverHeader fontWeight="bold">Event Info</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <Box mb={1}>
            <Box display="flex" alignItems="center">
              <Icon as={Event} mr={2} />
              <Text fontSize="sm">{moment(event.start_time).fromNow()}</Text>
            </Box>
          </Box>
          <Box py={2}>
            <Text fontSize="xl" fontWeight="bold">
              {event.title}
            </Text>
            <Text fontSize="md">{event.description || event.title}</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderTopWidth="1px"
            borderTopColor="gray.300"
            pt={2}
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <Icon as={LocationOn} mr={1} />
              {linkLocation ? (
                <Text as={Link} to={linkLocation} textDecor="underline">
                  {eventLocationName}
                </Text>
              ) : (
                <Text>{eventLocationName}</Text>
              )}
            </Box>
            <Box>
              {isAdmin ? (
                <Button onClick={handleUpdate} mr={1}>
                  Edit
                </Button>
              ) : (
                ''
              )}
              {linkLocation ? (
                <Button
                  colorScheme="purple"
                  onClick={() => history.push(linkLocation)}
                >
                  Join
                </Button>
              ) : (
                ''
              )}
            </Box>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default EventInfoPopOver;
