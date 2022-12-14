import { ChakraProvider, theme } from '@chakra-ui/react';
import { DialogProvider } from 'app/components/Dialog/Dialog';
import * as React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createRenderer } from 'react-test-renderer/shallow';
import { configureAppStore } from 'store/configureStore';

import { App } from '../index';

const renderer = createRenderer();
const store = configureAppStore();

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(
      <HelmetProvider>
        <React.StrictMode>
          <ChakraProvider theme={theme}>
            <DialogProvider>
              <Provider store={store}>
                <App />
              </Provider>
            </DialogProvider>
          </ChakraProvider>
        </React.StrictMode>
      </HelmetProvider>,
    );
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
