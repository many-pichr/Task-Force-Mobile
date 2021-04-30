// placeReducer.js

import { MAP } from '../actions/types';

const initialState = {
    placeName: '',
    map: {
        item:null
    }
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case MAP:
            return {
                ...state,
                map: action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
