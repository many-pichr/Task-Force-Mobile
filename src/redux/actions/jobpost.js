// place.js

import { JOBPOST } from './types';

export const setJobPost = jobpost => {
    return {
        type: JOBPOST,
        payload: jobpost
    }
}
