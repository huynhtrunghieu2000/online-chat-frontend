/**
 *
 * Asynchronously loads the component for Messenger
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Messenger = lazyLoad(() => import('./index'));
