import { PayloadAction } from '@reduxjs/toolkit';
import { Channel } from 'app/core/models/Room';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { roomSaga } from './saga';
import { RoomState } from './types';

export const initialState: RoomState = {
  roomList: undefined,
  roomDetail: undefined,
  channelDetail: undefined,
  messages: [],
  currentMeeting: null,
  isJoinRoomSuccess: false,
  isCreateRoomSuccess: false,
  isUpdateRoomDetailSuccess: false,
  isLeaveRoomSuccess: false,
  isDeleteRoomSuccess: false,
  isInviteUserSuccess: false,
  isRemoveMemberSuccess: false,
  isUpdateRoleMemberSuccess: false,
  isCreateChannelSuccess: false,
  isUpdateChannelSuccess: false,
  isRemoveChannelSuccess: false,
  isCreateEventSuccess: false,
  isUpdateEventSuccess: false,
  socketCondition: {},
  isLoading: false,
  hasError: false,
  error: '',
};

const slice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    getRoomList: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    getRoomListSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomList: action.payload,
        error: null,
        hasError: false,
      };
    },
    getRoomListFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearGetRoomList: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        roomList: undefined,
      };
    },
    createRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    createRoomSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: action.payload.detail,
        roomList: action.payload.list,
        isCreateRoomSuccess: true,
      };
    },
    createRoomFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload.message,
      };
    },
    clearCreateRoom: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isCreateRoomSuccess: false,
      };
    },
    getRoomDetail: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    getRoomDetailSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: action.payload,
      };
    },
    getRoomDetailFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearGetRoomDetail: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        roomDetail: undefined,
      };
    },
    updateRoomDetail: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isUpdateRoomDetailSuccess: false,
      };
    },
    updateRoomDetailSuccess: (state: RoomState, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomList: state.roomList.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload } : room,
        ),
        roomDetail: {
          ...state.roomDetail,
          ...action.payload,
        },
        isUpdateRoomDetailSuccess: true,
      };
    },
    updateRoomDetailFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isUpdateRoomDetailSuccess: false,
      };
    },
    clearUpdateRoomDetail: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isUpdateRoomDetailSuccess: false,
      };
    },
    leaveRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isLeaveRoomSuccess: false,
      };
    },
    leaveRoomSuccess: (state: RoomState, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomList: state.roomList.filter(room => room.id !== action.payload),
        roomDetail: null,
        isLeaveRoomSuccess: true,
      };
    },
    leaveRoomFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isLeaveRoomSuccess: false,
      };
    },
    clearLeaveRoom: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isLeaveRoomSuccess: false,
      };
    },
    deleteRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isDeleteRoomSuccess: false,
      };
    },
    deleteRoomSuccess: (state: RoomState, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomList: state.roomList.filter(room => room.id !== action.payload),
        roomDetail: null,
        isDeleteRoomSuccess: true,
      };
    },
    deleteRoomFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isDeleteRoomSuccess: false,
      };
    },
    clearDeleteRoom: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isDeleteRoomSuccess: false,
      };
    },
    removeMember: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isRemoveMemberSuccess: false,
      };
    },
    removeMemberSuccess: (state: RoomState, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: {
          ...state.roomDetail,
          Users: state.roomDetail.Users.filter(
            user => user.id !== action.payload,
          ),
        },
        isRemoveMemberSuccess: true,
      };
    },
    removeMemberFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isRemoveMemberSuccess: false,
      };
    },
    clearRemoveMember: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isRemoveMemberSuccess: false,
      };
    },
    updateRoleMember: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isUpdateRoleMemberSuccess: false,
      };
    },
    updateRoleMemberSuccess: (state: RoomState, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: {
          ...state.roomDetail,
          Users: state.roomDetail.Users.map(user =>
            user.id !== action.payload.user_id
              ? user
              : { ...user, ClassroomMember: { role: action.payload.role } },
          ),
        },
        isUpdateRoleMemberSuccess: true,
      };
    },
    updateRoleMemberFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isUpdateRoleMemberSuccess: false,
      };
    },
    clearUpdateRoleMember: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isUpdateRoleMemberSuccess: false,
      };
    },
    getChannelDetail: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    getChannelDetailSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        channelDetail: action.payload,
        messages: action.payload.Messages,
      };
    },
    getChannelDetailFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload?.message,
      };
    },
    clearGetChannelDetail: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        channelDetail: undefined,
        messages: [],
      };
    },
    createChannel: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    createChannelSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: {
          ...state.roomDetail,
          Channels: [...state.roomDetail?.Channels, action.payload.detail],
        },
        isCreateChannelSuccess: true,
      };
    },
    createChannelFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload.message,
      };
    },
    clearCreateChannel: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isCreateChannelSuccess: false,
      };
    },
    updateChannel: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isUpdateChannelSuccess: false,
      };
    },
    updateChannelSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        channelDetail: {
          ...state.channelDetail,
          ...action.payload,
        },
        roomDetail: {
          ...state.roomDetail,
          Channels: state.roomDetail?.Channels.map(channel =>
            channel.id === +action.payload.id
              ? { ...channel, ...action.payload }
              : channel,
          ),
        },
        isUpdateChannelSuccess: true,
      };
    },
    updateChannelFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isUpdateChannelSuccess: false,
      };
    },
    clearUpdateChannel: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isUpdateChannelSuccess: false,
      };
    },
    removeChannel: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isRemoveChannelSuccess: false,
      };
    },
    removeChannelSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        channelDetail: null,
        roomDetail: {
          ...state.roomDetail,
          Channels: state.roomDetail?.Channels.filter(
            channel => channel.id !== action.payload,
          ),
        },
        isRemoveChannelSuccess: true,
      };
    },
    removeChannelFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isRemoveChannelSuccess: false,
      };
    },
    clearRemoveChannel: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        isRemoveChannelSuccess: false,
      };
    },
    sendMessageChannel: (state, action: PayloadAction<any>) => {
      console.log(
        '🚀 ~ file: index.ts ~ line 428 ~ action.payload',
        action.payload,
      );
      return {
        ...state,
        isLoading: true,
      };
    },
    sendMessageChannelSuccess: (state, action: PayloadAction<any>) => {
      console.log(action);
      return {
        ...state,
        isLoading: false,
      };
    },
    sendMessageChannelFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload.message,
      };
    },
    newMessageChannelReceived: (state, action: PayloadAction<any>) => {
      console.log('new msg received', action);
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    },
    currentMeetingChanged: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        currentMeeting: action.payload,
      };
    },
    inviteUserToRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    inviteUserToRoomSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        hasError: false,
        isInviteUserSuccess: true,
        roomDetail: action.payload,
      };
    },
    inviteUserToRoomError: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasError: true,
        isInviteUserSuccess: false,
      };
    },
    clearInviteUserToRoom: state => {
      return {
        ...state,
        isLoading: true,
        isInviteUserSuccess: false,
        hasError: true,
        error: null,
      };
    },
    updateUserJoiningInRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        roomDetail: {
          ...state.roomDetail,
          Channels: state.roomDetail.Channels.map(
            channel => (channel.users = action.payload),
          ),
        },
      };
    },
    getRoomByInviteCode: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    getRoomByInviteCodeSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: action.payload,
      };
    },
    getRoomByInviteCodeFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isJoinRoomSuccess: false,
      };
    },
    clearGetRoomByInviteCode: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        roomDetail: undefined,
      };
    },
    joinRoomByInviteCode: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isJoinRoomSuccess: false,
      };
    },
    joinRoomByInviteCodeSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        roomDetail: action.payload,
        isJoinRoomSuccess: true,
      };
    },
    joinRoomByInviteCodeFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isJoinRoomSuccess: false,
      };
    },
    clearJoinRoomByInviteCode: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: '',
        roomDetail: undefined,
        isJoinRoomSuccess: false,
      };
    },
    createRoomEvent: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isCreateEventSuccess: false,
      };
    },
    createRoomEventSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        isCreateEventSuccess: true,
        hasError: false,
        error: '',
        roomDetail: {
          ...state.roomDetail,
          Events: [...state.roomDetail.Events, action.payload],
        },
      };
    },
    createRoomEventFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isCreateEventSuccess: false,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearCreateRoomEvent: state => {
      return {
        ...state,
        isCreateEventSuccess: false,
        isLoading: false,
        hasError: false,
        error: '',
      };
    },
    updateRoomEvent: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isUpdateEventSuccess: false,
      };
    },
    updateRoomEventSuccess: (state, action: PayloadAction<any>) => {
      const newEvents = state.roomDetail.Events.map(event =>
        event.id === action.payload.id ? action.payload : event,
      );
      return {
        ...state,
        isLoading: false,
        isUpdateEventSuccess: true,
        hasError: false,
        error: '',
        roomDetail: {
          ...state.roomDetail,
          Events: newEvents,
        },
      };
    },
    updateRoomEventFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isUpdateEventSuccess: false,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearUpdateRoomEvent: state => {
      return {
        ...state,
        isUpdateEventSuccess: false,
        isLoading: false,
        hasError: false,
        error: '',
      };
    },
    deleteRoomEvent: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isDeleteEventSuccess: false,
      };
    },
    deleteRoomEventSuccess: (state, action: PayloadAction<any>) => {
      const newEvents = state.roomDetail.Events.filter(
        event => event.id !== action.payload.id,
      );
      return {
        ...state,
        isLoading: false,
        isDeleteEventSuccess: true,
        hasError: false,
        error: '',
        roomDetail: {
          ...state.roomDetail,
          Events: newEvents,
        },
      };
    },
    deleteRoomEventFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isDeleteEventSuccess: false,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearDeleteRoomEvent: state => {
      return {
        ...state,
        isUpdateEventSuccess: false,
        isLoading: false,
        hasError: false,
        error: '',
      };
    },
    socketDisconnected: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        socketCondition: {
          isConnected: false,
          message: action.payload,
        },
      };
    },
    socketError: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        socketCondition: {
          ...state.socketCondition,
          error: action.payload,
        },
      };
    },
    socketReconnected: state => {
      return {
        ...state,
        socketCondition: {
          ...state.socketCondition,
          isConnected: false,
        },
      };
    },
  },
});

export const { actions: roomActions } = slice; // using for saga

export const useRoomSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: roomSaga });
  return { actions: slice.actions }; // using for dispatch
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useRoomSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
