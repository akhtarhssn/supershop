import { IStore } from "@/types/types";
import { baseApi } from "./baseApi";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyStore: builder.query<{ data: IStore }, void>({
      query: () => "/stores/my-store",
      providesTags: (result) =>
        result ? [{ type: "Stores", id: result.data._id }] : ["Stores"],
    }),

    createStore: builder.mutation<{ data: IStore }, FormData>({
      query: (data) => ({
        url: "/stores",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stores"],
    }),

    updateStore: builder.mutation<
      { data: IStore },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/stores/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Stores", id: result.data._id }] : ["Stores"],
    }),
    getAllStores: builder.query<{ data: IStore[] }, void>({
      query: () => "/stores",
      providesTags: ["Stores"],
    }),
    getSingleStore: builder.query<{ data: IStore }, string>({
      query: (id) => `/stores/${id}`,
      providesTags: (result, error, id) => [{ type: "Stores", id }],
    }),
  }),
});

export const {
  useGetMyStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useGetAllStoresQuery,
  useGetSingleStoreQuery,
} = storeApi;
