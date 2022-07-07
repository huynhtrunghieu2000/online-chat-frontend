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

const socketService =
  SocketClient.getInstance()?.Socket || new SocketClient().Socket;
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
    console.log(response);
    yield put(actions.getRoomDetailSuccess(response));
  } catch (error) {
    yield put(actions.getRoomDetailFailure(error));
  }
}
function* getRoomByInviteCode({ payload }) {
  try {
    const response = yield call(
      HTTPService.get,
      `${API_ENDPOINT.room.index}/invite`,
      payload,
    );
    yield put(actions.getRoomByInviteCodeSuccess(response));
  } catch (error) {
    yield put(actions.getRoomByInviteCodeFailure(error));
  }
}

function* joinRoomByInviteCode({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      `${API_ENDPOINT.room.index}/invite`,
      payload,
    );
    yield put(actions.joinRoomByInviteCodeSuccess(response));
  } catch (error) {
    yield put(actions.joinRoomByInviteCodeFailure(error));
  }
}

function* updateRoomDetail({ payload }) {
  try {
    const response = yield call(
      HTTPService.put,
      `${API_ENDPOINT.room.index}/${payload.id}`,
      payload,
    );
    yield put(actions.updateRoomDetailSuccess(response));
  } catch (error) {
    yield put(actions.updateRoomDetailFailure(error));
  }
}

function* leaveRoom({ payload }) {
  try {
    const response = yield call(
      HTTPService.delete,
      `${API_ENDPOINT.room.index}/${payload.id}/member`,
      payload,
    );
    console.log(response);
    yield put(actions.leaveRoomSuccess(response));
  } catch (error) {
    yield put(actions.leaveRoomFailure(error));
  }
}

function* deleteRoom({ payload }) {
  try {
    console.log(payload);
    const response = yield call(
      HTTPService.delete,
      `${API_ENDPOINT.room.index}/${payload.id}`,
      payload,
    );
    console.log(response);
    yield put(actions.deleteRoomSuccess(response));
  } catch (error) {
    yield put(actions.deleteRoomFailure(error));
  }
}

function* removeMember({ payload }) {
  try {
    const response = yield call(
      HTTPService.delete,
      `${API_ENDPOINT.room.index}/${payload.id}/member`,
      payload,
    );
    console.log(response);
    yield put(actions.removeMemberSuccess(payload.user_id));
  } catch (error) {
    yield put(actions.removeMemberFailure(error));
  }
}

function* updateRoleMember({ payload }) {
  try {
    const response = yield call(
      HTTPService.put,
      `${API_ENDPOINT.room.index}/${payload.id}/member`,
      payload,
    );
    yield put(actions.updateRoleMemberSuccess(payload));
  } catch (error) {
    yield put(actions.updateRoleMemberFailure(error));
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
    socketService.emit(SOCKET_EVENT.CHANNEL.JOIN, idChannel, (data: any) => {
      console.log('joinSuccess');
    });
    yield put(actions.getChannelDetailSuccess(response));
  } catch (error) {
    yield put(actions.getChannelDetailFailure(error));
  }
}

function* updateChannel({ payload }) {
  try {
    const response = yield call(
      HTTPService.put,
      `${API_ENDPOINT.channel.index}/${payload.id}`,
      payload,
    );
    yield put(actions.updateChannelSuccess(response));
  } catch (error) {
    yield put(actions.updateChannelFailure(error));
  }
}

function* createRoomEvent({ payload }) {
  try {
    const response = yield call(
      HTTPService.post,
      `${API_ENDPOINT.room.index}/${payload.id}/event`,
      payload,
    );
    yield put(actions.createRoomEventSuccess(response));
  } catch (error) {
    yield put(actions.createRoomEventFailure(error));
  }
}

function* updateRoomEvent({ payload }) {
  try {
    const response = yield call(
      HTTPService.put,
      `${API_ENDPOINT.room.index}/${payload.id}/event`,
      payload,
    );
    yield put(actions.updateRoomEventSuccess(payload.event));
  } catch (error) {
    yield put(actions.updateRoomEventFailure(error));
  }
}
function* deleteRoomEvent({ payload }) {
  try {
    const response = yield call(
      HTTPService.delete,
      `${API_ENDPOINT.room.index}/${payload.id}/event`,
      payload,
    );
    yield put(actions.deleteRoomEventSuccess(payload.event));
  } catch (error) {
    yield put(actions.deleteRoomEventFailure(error));
  }
}

function* removeChannel({ payload }) {
  try {
    yield call(
      HTTPService.delete,
      `${API_ENDPOINT.channel.index}/${payload.id}`,
      payload,
    );
    yield put(actions.removeChannelSuccess(payload.id));
  } catch (error) {
    yield put(actions.removeChannelFailure(error));
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

function* inviteUserToRoom({ payload }) {
  try {
    const data = {
      user_ids: payload.userIds,
    };
    const response = yield call(
      HTTPService.post,
      `${API_ENDPOINT.room.index}/${payload.roomId}/member`,
      data,
    );

    yield put(actions.inviteUserToRoomSuccess(response));
  } catch (error) {
    yield put(actions.inviteUserToRoomError(error));
  }
}

// ================= Socket Channel ==================
const subscribeSocketChannel = (socket: Socket) => {
  return eventChannel(emit => {
    socket.on(SOCKET_EVENT.CHANNEL.NEW_MESSAGE, data => {
      emit(actions.newMessageChannelReceived(data));
    });
    socket.io.on('error', error => {
      emit(actions.socketError(error));
    });
    socket.io.on('reconnect', attempt => {
      console.log(
        '🚀 ~ file: saga.ts ~ line 298 ~ subscribeSocketChannel ~ attempt',
        attempt,
      );
      emit(actions.socketReconnected());
    });
    socket.on('disconnected', () => {
      emit(actions.socketDisconnected('Disconnected from server...'));
    });
    socket.on('new-producer', ({ producerId }) => {
      emit(actions.currentMeetingChanged(producerId));
    });
    socket.on('producer-closed', ({ remoteProducerId }) => {
      emit(actions.currentMeetingChanged(remoteProducerId));
    });
    socket.on('channel:userJoin', data => {});
    socket.on('channel:userLeave', data => {});
    socket.on('newNotification', data => {
      emit(authSliceActions.receivedNewNotification(data));
    });
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

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(sendMessageChannel, socket);
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
  yield takeLatest(actions.updateRoomDetail, updateRoomDetail);
  yield takeLatest(actions.createRoom, createRoom);
  yield takeLatest(actions.getChannelDetail, getChannelDetail);
  yield takeLatest(actions.createChannel, createChannel);
  yield takeLatest(actions.inviteUserToRoom, inviteUserToRoom);
  yield takeLatest(actions.leaveRoom, leaveRoom);
  yield takeLatest(actions.removeMember, removeMember);
  yield takeLatest(actions.updateRoleMember, updateRoleMember);
  yield takeLatest(actions.updateChannel, updateChannel);
  yield takeLatest(actions.removeChannel, removeChannel);
  yield takeLatest(actions.getRoomByInviteCode, getRoomByInviteCode);
  yield takeLatest(actions.joinRoomByInviteCode, joinRoomByInviteCode);
  yield takeLatest(actions.createRoomEvent, createRoomEvent);
  yield takeLatest(actions.updateRoomEvent, updateRoomEvent);
  yield takeLatest(actions.deleteRoomEvent, deleteRoomEvent);
  yield takeLatest(actions.deleteRoom, deleteRoom);
}
