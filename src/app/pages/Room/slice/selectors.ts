import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.room || initialState;

export const selectClassroom = createSelector([selectSlice], state => state);
