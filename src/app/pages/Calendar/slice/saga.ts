import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { calendarActions as actions } from '.';

import { API_ENDPOINT } from 'app/core/constants/endpoint';
import HTTPService from 'app/core/services/http.service';
import { Event } from 'app/core/models/Event';
import { sanitizeObject } from 'app/core/utils/dataUtils';

function* getEvents() {
  try {
    const res = yield call(HTTPService.get, API_ENDPOINT.event.index);
    yield put(actions.getEventsSuccess(res.map(event => new Event(event))));
  } catch (error) {
    yield put(actions.getEventsFailure(error));
  }
}

function* createNewEvents(action) {
  try {
    const newEvent = {
      start_time: action.payload.start,
      end_time: action.payload.end,
      title: action.payload.title,
      description: action.payload.description,
    };
    const res = yield call(
      HTTPService.post,
      API_ENDPOINT.event.index,
      newEvent,
    );
    console.log(res);
    yield put(actions.createNewEventsSuccess(new Event(res)));
  } catch (error) {
    yield put(actions.createNewEventsFailure(error));
  }
}

function* updateEvents(action) {
  try {
    const event = Event.toRequestBody(action.payload);
    const res = yield call(
      HTTPService.put,
      API_ENDPOINT.event.index,
      sanitizeObject(event),
    );
    console.log(res);
    yield put(actions.updateEventsSuccess(new Event(res)));
  } catch (error) {
    yield put(actions.updateEventsFailure(error));
  }
}

function* deleteEvents(action) {
  try {
    const id = action.payload;
    yield call(HTTPService.delete, API_ENDPOINT.event.index, {
      id,
    });
    yield put(actions.deleteEventsSuccess({ event_id: id }));
  } catch (error) {
    yield put(actions.deleteEventsFailure(error));
  }
}

export function* calendarSaga() {
  yield takeLatest(actions.getEvents.type, getEvents);
  yield takeLatest(actions.createNewEvents.type, createNewEvents);
  yield takeLatest(actions.updateEvents.type, updateEvents);
  yield takeLatest(actions.deleteEvents.type, deleteEvents);
}
