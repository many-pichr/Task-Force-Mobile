// place.js

import { AUDIOID } from './types';

export const setId = id => {
    return {
        type: AUDIOID,
        payload: id
    }
}
