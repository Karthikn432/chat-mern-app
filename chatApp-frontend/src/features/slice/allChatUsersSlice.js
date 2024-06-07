import { createSlice } from "@reduxjs/toolkit"


const initialState = []

const allChatUsersSlice = createSlice({
    name:'selectedMsg',
    initialState,
    reducers:{
        getAllChatUsers : (state, action) => {
            return state = action.payload
        },
      
    }
})

export const { getAllChatUsers } = allChatUsersSlice.actions;
export default allChatUsersSlice.reducer;
