import * as React from 'react';
import { render } from '@testing-library/react';

import { Auth } from '..';

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

describe('<Authentication  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Auth />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
