// 1. Import the extendTheme function
import { theme as chakraTheme } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    primary: '#9F7AEA',
    secondary: '#F59443',
  },
  fonts: {
    ...chakraTheme.fonts,
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  styles: {
    global: {
      html: {
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
        fontFamily: 'body',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
    },
  },
});
