import { Box, Icon, Text } from '@chakra-ui/react';
import { FiberManualRecord } from '@mui/icons-material';
import moment from 'moment';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from 'types';
import { useAuthSliceSlice } from 'app/pages/Auth/slice';

enum NotificationType {
  ROOM_INVITATION = 'ROOM_INVITATION',
  ROOM_ROLE_CHANGE = 'ROOM_ROLE_CHANGE',
  EVENT_INVITED = 'EVENT_INVITED',
  EVENT_REMOVED = 'EVENT_REMOVED',
  EVENT_CHANGED = 'EVENT_CHANGED',
}

const NotificationBody = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const notifications = useSelector(
    (state: RootState) => state.authSlice?.data?.user.notifications,
  );

  return (
    <Box>
      {notifications?.length ? (
        [...notifications]?.reverse()?.map(notification => (
          <Box
            key={notification.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            borderRadius={4}
            _hover={{
              backgroundColor: 'gray.200',
            }}
            cursor="pointer"
            onClick={() => {
              if (notification.type === NotificationType.ROOM_INVITATION) {
                const roomId = notification.data.room.id;
                history.push(`/rooms/${roomId}`);
              }
              if (notification.type === NotificationType.EVENT_INVITED) {
                history.push(`/calendar`);
              }
              dispatch(
                actions.updateReadNotification({
                  is_read: true,
                  ids: [notification.id],
                }),
              );
            }}
          >
            <Box>
              {/* Message */}
              {notification.type === NotificationType.ROOM_INVITATION && (
                <Box display="flex">
                  <Text fontSize="sm">You are added into room: </Text>
                  &nbsp;
                  <Text fontSize="sm" fontWeight={600}>
                    {notification.data.room.name}
                  </Text>
                </Box>
              )}
              {notification.type === NotificationType.EVENT_INVITED && (
                <Box display="flex" flexWrap="wrap">
                  <Text fontSize="sm" fontWeight={600}>
                    {notification.data.created_by.email}
                  </Text>
                  &nbsp;
                  <Text fontSize="sm">invite you to an event</Text>
                </Box>
              )}
              <Text fontSize="sm" color="purple.500" fontWeight={600}>
                {moment(notification.createdAt).fromNow()}
              </Text>
            </Box>
            {notification.is_read ? (
              ''
            ) : (
              <Icon
                as={FiberManualRecord}
                color="purple.500"
                w={'20px'}
                h={'20px'}
              />
            )}
          </Box>
        ))
      ) : (
        <Box></Box>
      )}
    </Box>
  );
};

export default NotificationBody;
