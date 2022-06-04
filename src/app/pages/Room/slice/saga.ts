import { useMediaSoup } from './../../../core/contexts/mediasoup';
import { SocketClient } from './../../../core/contexts/socket-client';
import { API_ENDPOINT } from 'app/core/constants/endpoint';
// import { Room } from 'app/core/models/Room';
import { EventChannel, eventChannel } from 'redux-saga';
import HTTPService from 'app/core/services/http.service';
import {
  take,
  call,
  put,
  select,
  takeLatest,
  cancel,
  fork,
  race,
} from 'redux-saga/effects';
import { roomActions as actions } from '.';
import { authSliceActions } from 'app/pages/Auth/slice';
import { SOCKET_EVENT } from 'app/core/constants/socket-actionTypes';
import { format } from 'path';
import { Socket } from 'socket.io-client';

function* getRoomList() {
  try {
    const response = yield call(HTTPService.get, API_ENDPOINT.room.index, {});
    yield put(actions.getRoomListSuccess(response));
  } catch (error) {
    yield put(actions.getRoomListFailure(error));
  }
}

function* getRoomDetail({ payload }) {
  try {
    const response = yield call(
      HTTPService.get,
      `${API_ENDPOINT.room.index}/${payload.id}`,
      {},
    );
    yield put(actions.getRoomDetailSuccess(response));
  } catch (error) {
    yield put(actions.getRoomDetailFailure(error));
  }
}

function* createRoom({ payload }) {
  try {
    const data = {
      name: payload.name,
      created_by: payload.userId,
    };
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.room.index,
      data,
    );
    const responseList = yield call(
      HTTPService.get,
      API_ENDPOINT.room.index,
      {},
    );

    yield put(
      actions.createRoomSuccess({ detail: response, list: responseList }),
    );
  } catch (error) {
    yield put(actions.createRoomFailure(error));
  }
}

function* getChannelDetail({ payload }) {
  try {
    const idChannel = payload.idChannel;
    const response = yield call(
      HTTPService.get,
      `${API_ENDPOINT.channel.index}/${idChannel}`,
      {},
    );
    yield put(actions.getChannelDetailSuccess(response));
  } catch (error) {
    yield put(actions.getChannelDetailFailure(error));
  }
}

function* createChannel({ payload }) {
  try {
    const data = {
      channel: {
        name: payload.name,
        type: payload.type,
      },
      classroom_id: payload.roomId,
    };
    const response = yield call(
      HTTPService.post,
      API_ENDPOINT.channel.index,
      data,
    );
    const responseList = yield call(
      HTTPService.get,
      `${API_ENDPOINT.room.index}/${payload.roomId}`,
      {},
    );

    yield put(
      actions.createChannelSuccess({ detail: response, list: responseList }),
    );
  } catch (error) {
    yield put(actions.createChannelFailure(error));
    yield put(actions.clearGetChannelDetail());
  }
}

// function* joinChannel({ payload }) {
//   try {
//     const data = {
//       channel: {
//         name: payload.name,
//         type: payload.type,
//       },
//     };
//   } catch (error) {}
// }
// ================= Socket Channel ==================
const subscribeSocketChannel = (socket: Socket) => {
  return eventChannel(emit => {
    socket.on(SOCKET_EVENT.CHANNEL.NEW_MESSAGE, data => {
      emit(actions.newMessageChannelReceived(data));
    });
    socket.on('new-producer', ({ producerId }) => {
      emit(actions.currentMeetingChanged(producerId));
    });
    socket.on('producer-closed', ({ remoteProducerId }) => {
      emit(actions.currentMeetingChanged(remoteProducerId));
    });
    socket.on('ChannelUserActiveChanged', data => {});
    // This will listen to socket and emit Action when it receives socket event
    // Unsubscribe
    return () => {};
  });
};

// Excecute every channel emit
function* read(socket) {
  const channel = yield call(subscribeSocketChannel, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* sendMessageChannel(socket: Socket) {
  while (true) {
    const { payload } = yield take(actions.sendMessageChannel);
    socket.emit(SOCKET_EVENT.MESSAGE.SEND, payload, (data: any) => {
      console.log(data);
    });
  }
}

function* joinRoom(socket) {
  while (true) {
    const { payload } = yield take(actions.getChannelDetail);
    let roomId = 0;
    socket.emit(SOCKET_EVENT.CHANNEL.JOIN, payload.idChannel, (data: any) => {
      roomId = data;
    });
    // yield put(actions.getRoomDetail(roomId));
    // console.log(roomId);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(sendMessageChannel, socket);
  yield fork(joinRoom, socket);
}

function* flow() {
  yield race([
    take(authSliceActions.loginSuccess),
    take(authSliceActions.getLoggedInUserSuccess),
  ]);
  const socket = SocketClient.getInstance().Socket;
  while (true) {
    const task = yield fork(handleIO, socket);
    let action = yield take(authSliceActions.logout);
    yield cancel(task);
  }
}
// ================= Socket Channel ==================

export function* roomSaga() {
  yield fork(flow);
  yield takeLatest(actions.getRoomList, getRoomList);
  yield takeLatest(actions.getRoomDetail, getRoomDetail);
  yield takeLatest(actions.createRoom, createRoom);
  yield takeLatest(actions.getChannelDetail, getChannelDetail);
  yield takeLatest(actions.createChannel, createChannel);
}
