// placeReducer.js

import { LOADING } from '../actions/types';

const initialState = {
    placeName: '',
    loading: true
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOADING:
            return {
                ...state,
                loading:action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
