// place.js

import { LOADING } from './types';

export const setLoading = loading => {
    return {
        type: LOADING,
        payload: loading
    }
}
