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

        getLastMessageTime: builder.query({
            query: (id) => ({
                // const params = new URLSearchParams({ id }).toString();
                url: `${routesApi.app.getLastMessageTime}/${id}`,  //userGeneratePasword end point
                params: { id },
                method: "GET",
            }),
        }),

        getSelectedUserMessages: builder.query({
            query: (id) => ({
                // const params = new URLSearchParams({ id }).toString();
                url: `${routesApi.app.getMessages}/${id}`,  //userGeneratePasword end point
                params: { id },
                method: "GET",
            }),
            providesTags: ['Messages'],
        }),

        sendMessage: builder.mutation({
            query: (args) => {
                const { id, message, fileUrls, repliedTo } = args;
                console.log({fileUrls})
                return {
                    url: `${routesApi.app.sendMessage}/${id}`,  //signin end point
                    method: "POST",
                    body: { message, fileUrls, repliedTo },
                }
            },
            invalidatesTags: ["Messages"]
        }),

        fileUpload: builder.mutation({
            query: (args) => {
                console.log({args})
                // const {fileMetaData, id} = args
                return {
                    url: `${routesApi.app.uploadFile}/${args.id}`,
                    method: "POST",
                    body: args.fileData,
                };
            },
            invalidatesTags: ['Messages'],
        }),
        
        editMessage : builder.mutation({
            query: (args) => {
                const { id, message, fileUrls } = args;
                console.log({message})
                return {
                    url: `${routesApi.app.editMessage}/${id}`,  //signin end point
                    method: "PATCH",
                    body: { message, fileUrls },
                }
            },
            invalidatesTags: ["Messages"]
        }),

        deleteMessage : builder.mutation({
            query: ({id}) => {
                return {
                    url: `${routesApi.app.deleteMessage}/${id}`,  //signin end point
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Messages"]
        }),

        unreadMssages : builder.query({
            query: (id) => {
                return {
                    url: `${routesApi.app.unread}/${id}`,  //userGeneratePasword end point
                    method: "GET",
                }
            },
        }),

        setAsReadMessages : builder.mutation({
            query: ({messageIds}) => {
                return {
                    url: routesApi.app.markMessagesAsViewed,
                    method: "POST",
                    body: {messageIds}
                }
            },
        })

    })
})

export const {
    useGetConversationUsersQuery,
    useGetSelectedUserMessagesQuery,
    useLazyGetSelectedUserMessagesQuery,
    useSendMessageMutation,
    useGetLastMessageTimeQuery,
    useFileUploadMutation,
    useEditMessageMutation,
    useDeleteMessageMutation,
    useUnreadMssagesQuery,
    useSetAsReadMessagesMutation
} = usersQueryApi;