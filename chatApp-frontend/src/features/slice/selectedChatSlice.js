import { createSlice } from "@reduxjs/toolkit"

const getSelectedMsg = JSON.parse(localStorage.getItem("selected_msg"))

const initialState =getSelectedMsg ? getSelectedMsg : ''

const selectedMsgSlice = createSlice({
    name:'selectedMsg',
    initialState,
    reducers:{
        selectedMsg : (state, action) => {
            return state = action.payload
        },
        // updateLastMessage : (state, action) => {
        //     state.lastMsgDate = action.payload.lastMsgDate;
        // },
        resetSelectedMsg:() => {
           return initialState
        }
    }
})

export const { selectedMsg, resetSelectedMsg } = selectedMsgSlice.actions;
export default selectedMsgSlice.reducer;
