// placeReducer.js

import { JOBPOST } from '../actions/types';

const initialState = {
    placeName: '',
    data: {
        data:[],
        inprogress:[],
        completed:[]
    }
};

const placeReducer = (state = initialState, action) => {
    switch(action.type) {
        case JOBPOST:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
}

export default placeReducer;
