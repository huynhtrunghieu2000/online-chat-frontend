/**
 *
 * Asynchronously loads the component for Classroom
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Classroom = lazyLoad(
  () => import('./index'),
  module => module.Room,
);
