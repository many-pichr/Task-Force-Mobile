// placeReducer.js

import { NOTIFICATION } from '../actions/types';

const initialState = {
    placeName: '',
    notify: {
        "all":0,
        "count":0,
        "isMyPost": false,
        "isAllPost": false,
        "isProgress": false,
        "isComplete": false,
        "isMyTask": false,
        "isAllTask": false,
    }
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case NOTIFICATION:
            return {
                ...state,
                notify:action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
