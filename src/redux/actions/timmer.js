// place.js

import { TIMMER } from './types';

export const addTime = timmer => {
    return {
        type: TIMMER,
        payload: timmer
    }
}
