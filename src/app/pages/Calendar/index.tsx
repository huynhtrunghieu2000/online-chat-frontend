import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Scheduler } from '@aldabil/react-scheduler';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
  const currentDate = '2018-11-01';
  const schedulerData = [
    {
      startDate: '2018-11-01T09:45',
      endDate: '2018-11-01T11:00',
      title: 'Meeting',
    },
    {
      startDate: '2018-11-01T12:00',
      endDate: '2018-11-01T13:30',
      title: 'Go to a gym',
    },
  ];
  return (
    <ThemeProvider theme={theme}>
      <Scheduler view="month" />
    </ThemeProvider>
  );
};

export default Calendar;
