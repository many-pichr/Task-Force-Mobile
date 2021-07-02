// place.js

import { NOTIFICATION } from './types';

export const setNotify = notify => {
    return {
        type: NOTIFICATION,
        payload: notify
    }
}
