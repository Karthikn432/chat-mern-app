import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from '../rtkquery/rootApi';
import chatContactsReducer from '../slice/chatSlice'
export const store = configureStore({
    reducer: {
        [rootApi.reducerPath]: rootApi.reducer,
        chatContactsData : chatContactsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware),
})
