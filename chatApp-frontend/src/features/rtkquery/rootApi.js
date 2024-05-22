import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { routesApi } from '../../routes/RoutePath';

export const rootApi = createApi({
    reducerPath: "rootApi",
    baseQuery: fetchBaseQuery({
        baseUrl: routesApi.root,
        prepareHeaders: (headers) => {
            // const token = getTokenFromCookie('_webtoken');
            // const token = localStorage.getItem('token')
            
            // if (token) {
            //     headers.set('Authorization', `Bearer ${token}`);
            // }
            return headers;
        },
        credentials: 'include',
    }),
    endpoints: () => ({}),
})
