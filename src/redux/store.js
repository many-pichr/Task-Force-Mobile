// store.js

import { createStore, combineReducers } from 'redux';
import notifyReducer from './reducers/notifyReducer';
import timmerReducer from './reducers/timmerReducer';
import userReducer from './reducers/userReducer';
import audioIdReducer from './reducers/audioIdReducer';
import loadingReducer from './reducers/loadingReducer';
import settingReducer from './reducers/settingReducer';
import mapReducer from './reducers/mapReducer';
import notificationReducer from './reducers/notificationReducer';
import sfocusReducer from './reducers/sfocusReducer';

const rootReducer = combineReducers({
    places: notifyReducer,
    timmer: timmerReducer,
    user:userReducer,
    audioid:audioIdReducer,
    loading:loadingReducer,
    setting:settingReducer,
    map:mapReducer,
    notify:notificationReducer,
    focus:sfocusReducer,
});

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;
