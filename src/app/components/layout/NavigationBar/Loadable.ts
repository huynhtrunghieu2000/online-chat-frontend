/**
 *
 * Asynchronously loads the component for NavigationBar
 *
 */

import { lazyLoad } from 'utils/loadable';

export const NavigationBar = lazyLoad(
  () => import('./index'),
  module => module.NavigationBar,
);
