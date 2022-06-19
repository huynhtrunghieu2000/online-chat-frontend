import { messages } from '../../../components/layout/NavigationBar/messages';
import HTTPService from 'app/core/services/http.service';
import { call, put, takeLatest } from 'redux-saga/effects';
import { authSliceActions as actions } from '.';
import { removeToken, setToken } from 'app/core/services/storage.service';
import { API_ENDPOINT } from 'app/core/constants/endpoint';
import { SocketClient } from 'app/core/contexts/socket-client';

const connectSocket = () => {
  const socket = SocketClient.getInstance().Socket;
  socket.connect();
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

const disconnectSocket = () => {
  const socket = SocketClient.getInstance().Socket;
  socket.disconnect();
  return new Promise(resolve => {
    socket.on('disconnect', () => {
      resolve(socket);
    });
  });
};

function* login({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.user.login,
      payload,
    );
    setToken(response.token);
    yield call(connectSocket);
    yield put(actions.loginSuccess(response));
  } catch (error) {
    yield put(actions.loginFailure(error));
    removeToken();
  }
}

function* getLoggedInUser() {
  try {
    const response = yield call(HTTPService.get, API_ENDPOINT.user.me);
    yield call(connectSocket);
    yield put(actions.getLoggedInUserSuccess(response));
  } catch (error) {
    yield put(actions.getLoggedInUserFailure(error));
    removeToken();
  }
}

function* register({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.user.signup,
      payload,
    );
    yield put(actions.registerSuccess(response));
  } catch (error) {
    yield put(actions.registerFailure(error));
    removeToken();
  }
}

function* changePassword({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.user.changePassword,
      payload,
    );
    yield put(actions.changePasswordSuccess(response));
  } catch (error) {
    yield put(actions.changePasswordFailure(error));
  }
}

function* updateProfile({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.user.updateProfile,
      payload,
    );
    console.log(response);
    yield put(actions.updateProfileSuccess(response));
  } catch (error) {
    yield put(actions.updateProfileFailure(error));
  }
}

function* searchUser({ payload }) {
  try {
    const response = yield call(HTTPService.get, API_ENDPOINT.user.index, {
      search: payload.search,
    });
    yield put(actions.searchUserSuccess(response));
  } catch (error) {
    yield put(actions.searchUserFailure(error));
  }
}

function* registerVerify({ payload }) {
  try {
    const response = yield call(
      HTTPService.get,
      `${API_ENDPOINT.user.signupVerify}/${payload}`,
    );
    yield put(actions.registerVerifySuccess(response));
  } catch (error) {
    yield put(actions.registerVerifyFailure(error));
    removeToken();
  }
}

function* logout() {
  try {
    yield call(removeToken);
    yield call(disconnectSocket);
  } catch (error) {
    console.log(error);
  }
}

export function* authSliceSaga() {
  yield takeLatest(actions.login, login);
  yield takeLatest(actions.register, register);
  yield takeLatest(actions.updateProfile, updateProfile);
  yield takeLatest(actions.registerVerify, registerVerify);
  yield takeLatest(actions.getLoggedInUser, getLoggedInUser);
  yield takeLatest(actions.searchUser, searchUser);
  yield takeLatest(actions.logout, logout);
  yield takeLatest(actions.changePassword, changePassword);
}
