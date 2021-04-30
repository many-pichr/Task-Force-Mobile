// place.js

import { MAP } from './types';

export const setMap = map => {
    return {
        type: MAP,
        payload: map
    }
}
