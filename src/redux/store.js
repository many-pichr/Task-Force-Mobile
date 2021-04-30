// store.js

import { createStore, combineReducers } from 'redux';
import notifyReducer from './reducers/notifyReducer';
import timmerReducer from './reducers/timmerReducer';
import userReducer from './reducers/userReducer';
import audioIdReducer from './reducers/audioIdReducer';
import loadingReducer from './reducers/loadingReducer';
import settingReducer from './reducers/settingReducer';
import mapReducer from './reducers/mapReducer';

const rootReducer = combineReducers({
    places: notifyReducer,
    timmer: timmerReducer,
    user:userReducer,
    audioid:audioIdReducer,
    loading:loadingReducer,
    setting:settingReducer,
    map:mapReducer,
});

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;
