import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import configReducer from './configSlice'
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        config:configReducer,
        user:userReducer,
    }
});

export default store;
