/**
 *
 * Asynchronously loads the component for MessageBox
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MessageBox = lazyLoad(() => import('./index'));
