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
  isUpdateProfileSuccess: false,
  isRegisterSuccess: false,
  isChangePasswordSuccess: false,
  isForgotPasswordSuccess: false,
  isForgotPasswordVerifySuccess: false,
  isResetPasswordSuccess: false,
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
        errorMessage: action.payload?.message,
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
    searchUser(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
      };
    },
    searchUserSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          userList: action.payload,
        },
      };
    },
    searchUserFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload?.message,
      };
    },
    clearSearchUser(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        data: {
          ...state.data,
          userList: null,
        },
      };
    },
    register(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isRegisterSuccess: false,
      };
    },
    registerSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        isRegisterSuccess: true,
      };
    },
    registerFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
        isRegisterSuccess: false,
      };
    },
    clearRegister(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isRegisterSuccess: false,
      };
    },
    forgotPassword(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isForgotPasswordSuccess: false,
      };
    },
    forgotPasswordSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        isForgotPasswordSuccess: true,
      };
    },
    forgotPasswordFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
        isForgotPasswordSuccess: false,
      };
    },
    clearForgotPassword(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isForgotPasswordSuccess: false,
        data: null,
      };
    },
    forgotPasswordVerify(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isForgotPasswordVerifySuccess: false,
      };
    },
    forgotPasswordVerifySuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        isForgotPasswordVerifySuccess: true,
      };
    },
    forgotPasswordVerifyFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
        isForgotPasswordVerifySuccess: false,
      };
    },
    clearForgotPasswordVerify(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isForgotPasswordVerifySuccess: false,
      };
    },
    resetPassword(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isResetPasswordSuccess: false,
      };
    },
    resetPasswordSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        isResetPasswordSuccess: true,
      };
    },
    resetPasswordFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
        isResetPasswordSuccess: false,
      };
    },
    clearResetPassword(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isResetPasswordSuccess: false,
      };
    },
    changePassword(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isChangePasswordSuccess: false,
      };
    },
    changePasswordSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isChangePasswordSuccess: true,
      };
    },
    changePasswordFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload.message,
        isChangePasswordSuccess: false,
      };
    },
    clearChangePassword(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isChangePasswordSuccess: false,
      };
    },
    updateProfile(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: true,
        isUpdateProfileSuccess: false,
      };
    },
    updateProfileSuccess(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isUpdateProfileSuccess: true,
        data: {
          ...state.data,
          user: { ...state.data.user, ...action.payload.result },
        },
      };
    },
    updateProfileFailure(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        isUpdateProfileSuccess: false,
        isError: true,
        errorMessage: action.payload.message,
      };
    },
    clearUpdateProfile(state) {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMessage: '',
        isUpdateProfileSuccess: false,
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
    receivedNewNotification(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            notifications: [...state.data.user.notifications, action.payload],
          },
        },
      };
    },
    updateReadNotification(state, action: PayloadAction<any>) {
      const notificationIds: number[] = action.payload.ids;
      const newNotification = state.data.user.notifications.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, is_read: action.payload.is_read }
          : notification,
      );
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            notifications: newNotification,
          },
        },
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
