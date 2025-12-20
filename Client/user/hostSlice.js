import { createSlice } from "@reduxjs/toolkit"

const initialState = null

export const hostSlice = createSlice({
    name : 'host',
    initialState,
    reducers : {
        addHost : (state , action) => {
            return action.payload
        },
        removeHost : (state , action) => {
            return null
        }
    }
})

export const { addHost , removeHost } = hostSlice.actions
export default hostSlice.reducer