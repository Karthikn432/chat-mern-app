import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id : "",
    name : "", 
    profile : "", 
}

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
