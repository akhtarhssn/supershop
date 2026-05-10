import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { ApiResponse } from "@/types/types";

// Helper to get token from local storage (matching Zustand's auth-storage)
const getAccessToken = () => {
  return useAuthStore.getState().accessToken;
};

const updateAccessToken = (newToken: string) => {
  useAuthStore.getState().setAccessToken(newToken);
};

// Mutex to prevent multiple refresh calls
let mutexPromise: Promise<void> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (mutexPromise) {
    await mutexPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as ApiResponse<unknown>;

    if (errorData?.message === "jwt expired") {
      if (!mutexPromise) {
        mutexPromise = (async () => {
          try {
            const refreshResult = await baseQuery(
              {
                url: "/auth/refresh-token",
                method: "POST",
              },
              api,
              extraOptions,
            );

            if (refreshResult.data) {
              const refreshData = refreshResult.data as ApiResponse<{
                accessToken: string;
              }>;
              const newToken = refreshData.data.accessToken;
              updateAccessToken(newToken);
            } else {
              useAuthStore.getState().logout();
            }
          } finally {
            mutexPromise = null;
          }
        })();
      }

      await mutexPromise;

      result = await baseQuery(args, api, extraOptions);
    } else {
      useAuthStore.getState().logout();
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Categories", "Orders", "Stores", "User"],
  endpoints: () => ({}),
});
