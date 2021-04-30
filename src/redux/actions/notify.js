// place.js

import { NOTIFY } from './types';

export const addPlace = notify => {
    return {
        type: NOTIFY,
        payload: notify
    }
}
