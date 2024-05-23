import { createSlice } from "@reduxjs/toolkit"

const getSelectedUser = JSON.parse(localStorage.getItem("selected_conversation"))

const initialState =getSelectedUser ? getSelectedUser : {
    id : "",
    name : "", 
    profile : "", 
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
        resetFilterContacts:() => {
            return initialState
        }
    }
})

export const {getSelectedChatUser,resetFilterContacts} = chatSlice.actions;
export default chatSlice.reducer;
