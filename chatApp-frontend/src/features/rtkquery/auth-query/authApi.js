import { routesApi } from "../../../routes/RoutePath";
import { rootApi } from "../rootApi"

export const authapi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: ({ username, password }) => ({
                url: routesApi.auth.signin,  //signin end point
                method: "POST",
                body: { username, password },
            })
        }),
        register: builder.mutation({
            query: ({ fullName, username, password, confirmPassword, gender }) => ({
                url: routesApi.auth.register,  //register end point
                method: "POST",
                body: { fullName, username, password, confirmPassword, gender },
            })
        }),

        generateOtp: builder.mutation({
            query: ({ email }) => ({
                url: `${routesApi.auth.generateOtp}`,  //forgotPassword end point
                method: "POST",
                body: { email },
            })
        }),
        verifyOtp: builder.mutation({
            query: ({ email, otp }) => ({
                url: routesApi.auth.verifyOtp,  //verifyOtp end point
                method: "POST",
                body: { email, otp },
            })
        }),
        resetPassword: builder.mutation({
            query: ({ password, confirmPassword }) => ({
                url: routesApi.auth.resetPassword,  //forgotPassword end point
                method: "POST",
                body: { password, confirmPassword },
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: routesApi.auth.logout,  //logout end point
                method: "POST",
            })
        }),
        sessionStatus: builder.query({
            query: () => ({
                url: routesApi.auth.sessionStatus,  //userGeneratePasword end point
                method: "GET",
            })
        }),
    })
})

export const {
    useSigninMutation,
    useRegisterMutation,
    useGenerateOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useLazySessionStatusQuery } = authapi;