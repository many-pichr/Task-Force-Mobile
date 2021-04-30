// placeReducer.js

import { USER } from '../actions/types';

const initialState = {
    placeName: '',
    user: []
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
