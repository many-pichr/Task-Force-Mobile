// place.js

import { SETTING } from './types';

export const setSetting = setting => {
    return {
        type: SETTING,
        payload: setting
    }
}
