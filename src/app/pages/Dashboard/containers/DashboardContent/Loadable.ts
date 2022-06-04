/**
 *
 * Asynchronously loads the component for DashboardContent
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DashboardContent = lazyLoad(
  () => import('./index'),
  module => module.DashboardContent,
);
