// placeReducer.js

import { SETTING } from '../actions/types';

const initialState = {
    placeName: '',
    setting: {isAgent:false,touchId:true,lang:''}
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case SETTING:
            return {
                ...state,
                setting:action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
