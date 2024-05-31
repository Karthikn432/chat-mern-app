import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from '../rtkquery/rootApi';
import chatContactsReducer from '../slice/chatSlice';
import selectedMsgReducer from '../slice/selectedChatSlice'
import editMsgReducer from '../slice/editChatSlice'


export const store = configureStore({
    
    reducer: {
        [rootApi.reducerPath]: rootApi.reducer,
        chatContactsData : chatContactsReducer,
        selectedMsgData : selectedMsgReducer,
        editMsgData : editMsgReducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware),
})
