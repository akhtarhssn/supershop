import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/my-orders",
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetSingleOrderQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
