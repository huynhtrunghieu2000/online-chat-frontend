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
  isCreateRoomSuccess: false,
  isCreateChannelSuccess: false,
  isInviteUserSuccess: false,
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
        error: action.payload.message,
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
        error: action.payload.message,
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
    sendMessageChannel: (state, action: PayloadAction<any>) => {
      const newMessage = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        isMine: true,
        isSendSuccess: false,
      };
      return {
        ...state,
        isLoading: true,
        messages: [...state.messages, newMessage],
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
    inviteUserToRoomSuccess: state => {
      return {
        ...state,
        isLoading: false,
        error: null,
        hasError: false,
        isInviteUserSuccess: true,
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
    clearInviteUserToRoom: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isInviteUserSuccess: false,
        hasError: true,
        error: null,
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
