import {configureStore} from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice'
import JobReducer from './slices/JobSlice'
import ApplicationReducer from './slices/ApplicationSlice'
import AdminReducer from './slices/AdminSlice'
import cvReducer from './reducers/cvReducer'
import statsReducer from './slices/StatsSlice'

export const store = configureStore({
    reducer:{
        user:UserReducer,
        job:JobReducer,
        application:ApplicationReducer,
        admin:AdminReducer,
        cv: cvReducer,
        stats: statsReducer
    }
}) 
