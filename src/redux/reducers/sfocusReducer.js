// placeReducer.js

import { SFOCUS } from '../actions/types';

const initialState = {
    placeName: '',
    focus: {
        "MyTask": false,
        "MyPost": false,
        "isProgress": false,
        "isComplete": false,
    }
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case SFOCUS:
            return {
                ...state,
                focus:action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
