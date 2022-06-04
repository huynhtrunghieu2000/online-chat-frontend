/**
 *
 * Auth
 *
 */
import { Box } from '@chakra-ui/react';
import { NavigationBar } from 'app/components/layout/NavigationBar';
import { NotFoundPage } from 'app/components/NotFoundPage';
import { isAuthenticated } from 'app/core/modules/PrivateRoute';
import { getToken } from 'app/core/services/storage.service';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { RootState } from 'types';
import ForgotPassword from './containers/ForgotPassword';
import Login from './containers/Login';
import Register from './containers/Register';
import RegisterVerify from './containers/RegisterVerify';
import { messages } from './messages';
import { useAuthSliceSlice } from './slice';

export function Auth() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path } = useRouteMatch();
  const history = useHistory();
  const fromPath = useLocation<{ from: { pathname: 'path' } }>()?.state?.from;
  const dispatch = useDispatch();
  const { actions } = useAuthSliceSlice();

  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );

  // FIXME: Fix this after
  useEffect(() => {
    if (userData?.id) {
      if (fromPath) {
        history.push(fromPath.pathname);
      } else history.push('/dashboard');
    } else if (!userData?.id && getToken()) {
      dispatch(actions.getLoggedInUser());
    } else if (!userData?.id && !getToken()) {
      dispatch(actions.logout());
      history.push('/auth/login');
    }
  }, [userData, history, fromPath]);

  return (
    <Box>
      <Switch>
        <Route exact path={`${path}`}>
          <Redirect to={`${path}/login`} />
        </Route>
        <Route exact path={`${path}/login`} component={Login} />
        <Route exact path={`${path}/register`} component={Register} />
        <Route
          exact
          path={`${path}/register-verify`}
          component={RegisterVerify}
        />
        <Route
          exact
          path={`${path}/forgot-password`}
          component={ForgotPassword}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </Box>
  );
}
