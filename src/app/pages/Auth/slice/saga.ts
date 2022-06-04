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

// const disconnectListener = () => {
//   socket = io(socketServerURL);
//   return new Promise(resolve => {
//     socket.on('disconnect', () => {
//       resolve(socket);
//     });
//   });
// };

// const reconnectListener = () => {
//   socket = io(socketServerURL);
//   return new Promise(resolve => {
//     socket.on('reconnect', () => {
//       resolve(socket);
//     });
//   });
// };

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
    const response = yield call(HTTPService.get, API_ENDPOINT.user.index);
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
  yield takeLatest(actions.registerVerify, registerVerify);
  yield takeLatest(actions.getLoggedInUser, getLoggedInUser);
  yield takeLatest(actions.logout, logout);
}
