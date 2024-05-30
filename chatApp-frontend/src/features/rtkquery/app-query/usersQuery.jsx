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
                const { id, message, fileUrl } = args;
                console.log({message})
                return {
                    url: `${routesApi.app.sendMessage}/${id}`,  //signin end point
                    method: "POST",
                    body: { message, fileUrl },
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
        

    })
})

export const {
    useGetConversationUsersQuery,
    useGetSelectedUserMessagesQuery,
    useLazyGetSelectedUserMessagesQuery,
    useSendMessageMutation,
    useGetLastMessageTimeQuery,
    useFileUploadMutation } = usersQueryApi;