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
import { Box } from '@chakra-ui/react';

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
  const dispatch = useDispatch();
  const { actions } = useCalendarSlice();

  const events = useSelector(
    (state: RootState) => state.calendar?.events,
  ) as Event[];
  const eventDetail = useSelector(
    (state: RootState) => state.calendar?.eventDetail,
  );
  const isLoading = useSelector(
    (state: RootState) => state.calendar?.isLoading,
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
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          '.rs__outer_table > div': {
            overflow: 'hidden',
          },
          '.css-1jm7bvk-MuiAvatar-root': {
            backgroundColor: 'purple.300',
          },
        }}
      >
        <Scheduler
          view="month"
          week={{
            weekDays: [0, 1, 2, 3, 4, 5],
            weekStartOn: 6,
            startHour: 9,
            endHour: 17,
            step: 10,
          }}
          events={events || []}
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
