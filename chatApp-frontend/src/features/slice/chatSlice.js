import { createSlice } from "@reduxjs/toolkit"

const getSelectedUser = JSON.parse(localStorage.getItem("selected_conversation"))

const initialState =getSelectedUser ? getSelectedUser : {
    id : "",
    name : "", 
    profile : "", 
    lastMsgDate : ""
}
console.log({initialState})

const chatSlice = createSlice({
    name:'whatsappSendContacts',
    initialState,
    reducers:{
        getSelectedChatUser: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profile = action.payload.profile;
        },
        updateLastMessage : (state, action) => {
            state.lastMsgDate = action.payload.lastMsgDate;
        },
        resetSelectedChatUser:() => {
            return initialState
        }
    }
})

export const {getSelectedChatUser,updateLastMessage, resetSelectedChatUser} = chatSlice.actions;
export default chatSlice.reducer;
