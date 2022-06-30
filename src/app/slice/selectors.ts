import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.app || initialState;

export const selectApp = createSelector([selectSlice], state => state);
