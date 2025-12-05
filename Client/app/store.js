import { configureStore } from '@reduxjs/toolkit'
import  loggedInUserReducer  from '../user/userSlice.js'
import  roomIdReducer  from '../user/roomSlice.js'

export const store = configureStore({
    reducer : {
        loggedInUser : loggedInUserReducer,
        roomId : roomIdReducer,
    }
})