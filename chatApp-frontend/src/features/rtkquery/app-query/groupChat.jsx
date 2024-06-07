import { routesApi } from "../../../routes/RoutePath";
import { rootApi } from "../rootApi"

export const groupChatQueryApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        createGroup: builder.mutation({
            query: ({ groupName, participants }) => ({
                url: routesApi.app.createGroupChat,  //register end point
                method: "POST",
                body: { groupName, participants  },
            })
        }),
    })
})

export const {
    useCreateGroupMutation,
} = groupChatQueryApi;