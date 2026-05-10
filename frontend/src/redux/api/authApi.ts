import { ApiResponse, IUser, LoginPayload, LoginResponse } from "@/types/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (res: ApiResponse<LoginResponse>) => res.data,
    }),
    getMe: builder.query<ApiResponse<IUser>, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout", // Assuming there is a logout endpoint or just client-side clear
        method: "POST",
      }),
      invalidatesTags: ["User", "Stores", "Orders", "Products"],
    }),
    getSellers: builder.query<ApiResponse<IUser[]>, void>({
      query: () => "/users/sellers",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetSellersQuery,
} = authApi;
