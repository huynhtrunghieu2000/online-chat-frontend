import { createDraftSafeSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.authSlice || initialState;
const isVerifiedEmail = (state: RootState) => state.authSlice?.data.status;

export const selectIsVerifiedEmail = createDraftSafeSelector(
  isVerifiedEmail,
  state => state,
);

export const selectAuthSlice = createDraftSafeSelector(
  [selectSlice, isVerifiedEmail],
  state => state,
);
