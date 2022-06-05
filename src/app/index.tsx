/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, useHistory } from 'react-router-dom';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { Auth } from './pages/Auth';
import { APP_NAME } from './core/constants/general';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './core/modules/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthSliceSlice } from './pages/Auth/slice';
import { RootState } from 'types';
import { getToken } from './core/services/storage.service';
import { NavigationBar } from './components/layout/NavigationBar';
import { Messenger } from './pages/Messenger/Loadable';
import { Profile } from './pages/Profile/Loadable';
import { Calendar } from './pages/Calendar/Loadable';
import { Box } from '@chakra-ui/react';
import { SocketProvider } from 'app/core/contexts/socket';
import { Room } from './pages/Room';
import { SocketClient } from './core/contexts/socket-client';
import AvatarUpload from './pages/Profile/components/AvatarUpload';

export function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();
  const history = useHistory();
  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );

  React.useEffect(() => {
    if (!SocketClient.getInstance()) {
      new SocketClient();
    }
  }, []);

  React.useEffect(() => {
    if (!userData?.id && getToken()) {
      dispatch(actions.getLoggedInUser());
    } else if (!userData?.id && !getToken() && history) {
      dispatch(actions.logout());
      history.push('/auth/login');
    }
    if (userData?.id) {
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate={`%s - ${APP_NAME}`}
        defaultTitle={`${APP_NAME}`}
        htmlAttributes={{ lang: i18n.language }}
      ></Helmet>
      <Box display="flex" flexDir="column" w="full" h="full" pos="fixed">
        <NavigationBar />
        <AvatarUpload />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/auth" component={Auth} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/messenger" component={Messenger} />
          <PrivateRoute path="/rooms" component={Room} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/calendar" component={Calendar} />

          <Route path="/404" component={NotFoundPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Box>
    </BrowserRouter>
  );
}
