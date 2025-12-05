import { createSlice } from "@reduxjs/toolkit"

const initialState = null

export const roomSlice = createSlice({
    name : 'roomId',
    initialState,
    reducers : {
        addRoomId : (state , action) => {
            return action.payload
        },
        removeRoomId : (state , action) => {
            return null
        }
    }
})



export const { addRoomId , removeRoomId } = roomSlice.actions
export default roomSlice.reducer