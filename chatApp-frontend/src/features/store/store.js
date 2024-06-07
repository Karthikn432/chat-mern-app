import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from '../rtkquery/rootApi';
import chatContactsReducer from '../slice/chatSlice';
import selectedMsgReducer from '../slice/selectedChatSlice'
import editMsgReducer from '../slice/editChatSlice'
import fileReducer from '../slice/fileSlice'
import editFileReducer from '../slice/editFileSlice'
import allChatUsersReducer from '../slice/allChatUsersSlice'
import newMessageReducer from '../slice/newMessageSlice'




export const store = configureStore({
    
    reducer: {
        [rootApi.reducerPath]: rootApi.reducer,
        chatContactsData : chatContactsReducer,
        selectedMsgData : selectedMsgReducer,
        editMsgData : editMsgReducer,
        filesData : fileReducer,
        editFileData : editFileReducer,
        allChatUsersData : allChatUsersReducer,
        newMessageData : newMessageReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware),
})
