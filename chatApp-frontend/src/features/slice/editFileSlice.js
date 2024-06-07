import { createSlice } from "@reduxjs/toolkit"

const geteditFile = JSON.parse(localStorage.getItem("editFileInfo"))

const initialState = geteditFile ? geteditFile : ''

const editFileSlice = createSlice({
    name: 'editFiles',
    initialState,
    reducers: {
        editFilesMetaData: (state, action) => {
            return state = action.payload
        },
        // updateLastMessage : (state, action) => {
        //     state.lastMsgDate = action.payload.lastMsgDate;
        // },
        resetEditFile: () => {
            return initialState
        }
    }
})

export const { editFilesMetaData, resetEditFile } = editFileSlice.actions;
export default editFileSlice.reducer;
