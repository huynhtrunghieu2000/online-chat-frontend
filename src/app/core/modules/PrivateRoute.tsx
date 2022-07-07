import React from 'react';
import { decodeToken } from 'react-jwt';
import { getToken } from '../services/storage.service';
import { Redirect, Route, useLocation, useHistory } from 'react-router-dom';
import { CircularProgress } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

export const isAuthenticated = () => {
  const token = getToken();
  if (token) {
    const isTokenValid = decodeToken(token) as { id: number };
    return !!isTokenValid.id;
  }
  return false;
};

const PrivateRoute = ({ component: WrappedComponent, ...rest }) => {
  const location = useLocation();
  const history = useHistory();

  const userData = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  if (!isAuthenticated())
    history.push({
      pathname: '/auth/login',
      state: { from: location.pathname },
    });

  return !isAuthenticated() ? (
    <CircularProgress />
  ) : (
    <Route {...rest}>
      <WrappedComponent />
    </Route>
  );
};

export default PrivateRoute;
