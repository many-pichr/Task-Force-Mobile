// place.js

import { SFOCUS } from './types';

export const setFocus = focus => {
    return {
        type: SFOCUS,
        payload: focus
    }
}
