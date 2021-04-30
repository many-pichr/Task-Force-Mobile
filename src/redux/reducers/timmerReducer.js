// placeReducer.js

import { TIMMER } from '../actions/types';

const initialState = {
    placeName: '',
    timmer: []
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case TIMMER:
            return {
                ...state,
                timmer: {
                    date:new Date(),
                    pin: action.payload
                }
            };
        default:
            return state;
    }
}

export default placeReducer;
