/**
 *
 * Asynchronously loads the component for Calendar
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Calendar = lazyLoad(() => import('./index'));
