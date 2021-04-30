// place.js

import { USER } from './types';

export const setUser = user => {
    return {
        type: USER,
        payload: user
    }
}
