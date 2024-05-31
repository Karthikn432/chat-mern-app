import { createSlice } from "@reduxjs/toolkit"

const getEditMsg = JSON.parse(localStorage.getItem("Edit_msg"))

const initialState =getEditMsg ? getEditMsg : ''
console.log({initialState})

const editMsgSlice = createSlice({
    name:'EditMsg',
    initialState,
    reducers:{
        editMsg : (state, action) => {
            return state = action.payload
        },
        // updateLastMessage : (state, action) => {
        //     state.lastMsgDate = action.payload.lastMsgDate;
        // },
        resetEditMsg:() => {
           return initialState
        }
    }
})

export const { editMsg, resetEditMsg } = editMsgSlice.actions;
export default editMsgSlice.reducer;
