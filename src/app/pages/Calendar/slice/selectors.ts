import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.calendar || initialState;

export const selectCalendar = createSelector([selectSlice], state => state);
