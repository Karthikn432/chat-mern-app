import { createSlice } from "@reduxjs/toolkit"

const getFile = JSON.parse(localStorage.getItem("fileInfo"))

const initialState = {
    messageFiles: [],
    editFiles: []
};

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        filesDispatch: (state, action) => {
            const { context, path, type, name, size } = action.payload;
            const fileData = { path, type, name, size };
            if (context === 'message') {
                state.messageFiles.push(fileData);
            } else if (context === 'edit') {
                state.editFiles.push(fileData);
            }
        },
        resetMessageFiles: (state) => {
            state.messageFiles = [];
        },
        resetEditFiles: (state) => {
            state.editFiles = [];
        }
    }
})

export const { filesDispatch, resetMessageFiles, resetEditFiles } = fileSlice.actions;
export default fileSlice.reducer;
