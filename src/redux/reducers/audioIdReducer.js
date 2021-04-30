// placeReducer.js

import { AUDIOID } from '../actions/types';

const initialState = {
    placeName: '',
    id: null
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case AUDIOID:
            return {
                ...state,
                id:action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
