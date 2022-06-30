/**
 *
 * Classroom
 *
 */
import { Box, Image, Text } from '@chakra-ui/react';
import { NotFoundPage } from 'app/components/NotFoundPage';
// import { SocketContext } from 'app/core/contexts/socket';
import PrivateRoute from 'app/core/modules/PrivateRoute';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import RoomSideMenu from './components/RoomSideMenu';
import RoomContent from './containers/RoomContent';
import { useRoomSlice } from './slice';
import RoomEntry from 'assets/images/room-get-in.svg';
import { RootState } from 'types';
interface Props {}

export function Room(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path } = useRouteMatch();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();

  const socketCondition = useSelector(
    (state: RootState) => state.room?.socketCondition,
  );

  useEffect(() => {
    dispatch(actions.getRoomList({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box display="flex" h="calc(100% - 69px)">
      <RoomSideMenu />
      <Switch>
        <PrivateRoute path={`${path}/:idRoom`} component={RoomContent} />
        <Route
          component={() => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="full"
              flexDir="column"
            >
              <Image src={RoomEntry} height="30%" />
              <Text fontSize="xl" mt={3}>
                You can create or join room to meet your team!
              </Text>
            </Box>
          )}
        />
      </Switch>
    </Box>
  );
}
