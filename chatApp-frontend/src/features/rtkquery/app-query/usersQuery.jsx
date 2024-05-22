import { routesApi } from "../../../routes/RoutePath";
import { rootApi } from "../rootApi"

export const usersQueryApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({

        getConversationUsers: builder.query({
            query: (args) => {
                const { search, page, per_page } = args
                return {
                    url: routesApi.app.users,  //userGeneratePasword end point
                    method: "GET",
                    params: { search, page, per_page }
                }
            },
            providesTags: ['Users'],
        }),

        getSelectedUserMessages: builder.query({
            query: (id) => ({
                // const params = new URLSearchParams({ id }).toString();
                url: `${routesApi.app.getMessages}/${id}`,  //userGeneratePasword end point
                params: { id },
                method: "GET",
            })
        }),
        sendMessage: builder.mutation({
            query: ({ id, message }) => ({
                url: `${routesApi.app.sendMessage}/${id}`,  //signin end point
                method: "POST",
                body: { message },
            })
        }),

    })
})

export const {
    useGetConversationUsersQuery,
    useGetSelectedUserMessagesQuery,
    useLazyGetSelectedUserMessagesQuery,
    useSendMessageMutation } = usersQueryApi;