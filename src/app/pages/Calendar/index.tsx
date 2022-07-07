import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Scheduler } from '@aldabil/react-scheduler';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  EventActions,
  ProcessedEvent,
} from '@aldabil/react-scheduler/dist/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useCalendarSlice } from './slice';
import { Event } from 'app/core/models/Event';
import { Box, useToast } from '@chakra-ui/react';
import CalendarPopper from './components/CalendarPopper';

interface Props {}

const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: '600',
        },
      },
    },
  },
});
const Calendar = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const { actions } = useCalendarSlice();

  const events = useSelector(
    (state: RootState) => state.calendar?.events,
  ) as Event[];
  const isLoading = useSelector(
    (state: RootState) => state.calendar?.isLoading,
  );
  const isCreatedSuccess = useSelector(
    (state: RootState) => state.calendar?.isCreatedSuccess,
  );
  const isUpdatedSuccess = useSelector(
    (state: RootState) => state.calendar?.isUpdatedSuccess,
  );
  const isDeletedSuccess = useSelector(
    (state: RootState) => state.calendar?.isDeletedSuccess,
  );

  const createNewEvent = async (
    event: ProcessedEvent,
    action: EventActions,
  ) => {
    if (action === 'create') {
      const newEvent = {
        ...event,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
      };
      dispatch(actions.createNewEvents(newEvent));
    } else if (action === 'edit') {
      dispatch(actions.updateEvents(event));
    }
    return event;
  };

  const deleteEvent = async id => {
    dispatch(actions.deleteEvents(id));
  };

  const dragAndDropEvent = async (
    dropOn: Date,
    event: ProcessedEvent,
    originalEvent: ProcessedEvent,
  ) => {
    dispatch(actions.updateEvents(event));
  };

  React.useEffect(() => {
    dispatch(actions.getEvents());

    return () => {
      dispatch(actions.clearGetEvents());
    };
  }, []);

  React.useEffect(() => {
    if (isCreatedSuccess) {
      toast({
        status: 'success',
        title: 'New event created successfully.',
      });
      dispatch(actions.clearCreateNewEvents());
    }
  }, [isCreatedSuccess]);
  React.useEffect(() => {
    if (isUpdatedSuccess) {
      toast({
        status: 'success',
        title: 'Event updated successfully.',
      });
      dispatch(actions.clearUpdateEvents());
    }
  }, [isUpdatedSuccess]);
  React.useEffect(() => {
    if (isDeletedSuccess) {
      toast({
        status: 'success',
        title: 'Event deleted successfully.',
      });
      dispatch(actions.clearDeleteEvents());
    }
  }, [isDeletedSuccess]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          '.rs__outer_table > div': {
            overflowY: 'scroll',
            overflowX: 'hidden',
          },
          '.css-1jm7bvk-MuiAvatar-root': {
            backgroundColor: 'purple.300',
          },
        }}
      >
        <Scheduler
          view="month"
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: 0,
            endHour: 23,
          }}
          day={{
            startHour: 0,
            endHour: 23,
            step: 30,
          }}
          resourceViewMode="tabs"
          viewerExtraComponent={CalendarPopper}
          events={events ? [...events] : []}
          onConfirm={createNewEvent}
          onDelete={deleteEvent}
          onEventDrop={dragAndDropEvent}
          loading={isLoading}
          fields={[
            {
              name: 'description',
              type: 'input',
              config: {
                label: 'Description',
                min: 3,
                variant: 'outlined',
              },
            },
          ]}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Calendar;
