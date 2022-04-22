import * as React from 'react';
import { render } from '@testing-library/react';

import { NavigationBar } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe('<NavigationBar  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<NavigationBar />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
