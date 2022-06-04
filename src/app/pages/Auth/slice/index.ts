import { messages } from './../messages';
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSliceSaga } from './saga';
import { AuthSliceState } from './types';
import { removeToken } from 'app/core/services/storage.service';

export const initialState: AuthSliceState = {
  data: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

const slice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
      };
    },
    loginSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    },
    loginFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
      };
    },
    clearLogin(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
      };
    },
    getLoggedInUser(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    getLoggedInUserSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    },
    getLoggedInUserFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
      };
    },
    clearGetLoggedInUser(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
      };
    },
    register(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        ...action.payload,
      };
    },
    registerSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    },
    clearRegister(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
      };
    },
    registerFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
      };
    },
    registerVerify(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        ...action.payload,
      };
    },
    registerVerifySuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    },
    registerVerifyFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
      };
    },
    clearRegisterVerify(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
      };
    },
    logout(state) {
      return {
        ...state,
        data: null,
      };
    },
  },
});

export const { actions: authSliceActions } = slice;

export const useAuthSliceSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSliceSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useAuthSliceSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
