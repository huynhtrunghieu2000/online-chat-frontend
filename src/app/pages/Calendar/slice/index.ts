import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { calendarSaga } from './saga';
import { CalendarState } from './types';
import { Event } from 'app/core/models/Event';
import { sanitizeObject } from 'app/core/utils/dataUtils';

export const initialState: CalendarState = {
  events: null,
  eventDetail: null,
  isLoading: false,
  isProcessing: false,
  hasError: false,
  error: null,
  isCreatedSuccess: false,
  isUpdatedSuccess: false,
  isDeletedSuccess: false,
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
        isCreatedSuccess: false,
      };
    },
    createNewEventsSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        events: [...state.events, action.payload],
        error: null,
        hasError: false,
        isCreatedSuccess: true,
      };
    },
    createNewEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isCreatedSuccess: false,
      };
    },
    clearCreateNewEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        isCreatedSuccess: false,
      };
    },
    updateEvents: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isUpdatedSuccess: false,
      };
    },
    updateEventsSuccess: (state, action: PayloadAction<any>) => {

      const newEvents = (state.events as Event[]).map(event =>
        event.event_id !== action.payload.event_id
          ? event
          : { ...event, ...sanitizeObject(action.payload) },
      );
      return {
        ...state,
        isLoading: false,
        events: newEvents,
        error: null,
        hasError: false,
        isUpdatedSuccess: true,
      };
    },
    updateEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isUpdatedSuccess: false,
      };
    },
    clearUpdateEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        isUpdatedSuccess: false,
      };
    },
    deleteEvents: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: true,
        isDeletedSuccess: false,
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
        isDeletedSuccess: true,
      };
    },
    deleteEventsFailure: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.payload,
        isDeletedSuccess: false,
      };
    },
    clearDeleteEvents: state => {
      return {
        ...state,
        isLoading: false,
        hasError: false,
        error: null,
        isDeletedSuccess: false,
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
