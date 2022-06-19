import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { calendarSaga } from './saga';
import { CalendarState } from './types';
import { Event } from 'app/core/models/Event';

export const initialState: CalendarState = {
  events: null,
  eventDetail: null,
  isLoading: false,
  isProcessing: false,
  hasError: false,
  error: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents: state => {
      return {
        ...state,
        isLoading: true,
      };
    },
    getEventsSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        events: action.payload,
        error: null,
        hasError: false,
      };
    },
    getEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearGetEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        events: undefined,
      };
    },
    createNewEvents: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    createNewEventsSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        events: [...state.events, action.payload],
        error: null,
        hasError: false,
      };
    },
    createNewEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearCreateNewEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        events: undefined,
      };
    },
    updateEvents: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    updateEventsSuccess: (state, action: PayloadAction<any>) => {
      const newEvents = (state.events as Event[]).filter(
        event => event.event_id !== action.payload.event_id,
      );
      return {
        ...state,
        isLoading: false,
        events: [...newEvents, action.payload],
        error: null,
        hasError: false,
      };
    },
    updateEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearUpdateEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
      };
    },
    deleteEvents: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    deleteEventsSuccess: (state, action: PayloadAction<any>) => {
      const newEvents = (state.events as Event[]).filter(
        event => event.event_id !== action.payload.event_id,
      );
      return {
        ...state,
        isLoading: false,
        events: newEvents,
        error: null,
        hasError: false,
      };
    },
    deleteEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
      };
    },
    clearDeleteEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
      };
    },
  },
});

export const { actions: calendarActions } = slice;

export const useCalendarSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: calendarSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useCalendarSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
