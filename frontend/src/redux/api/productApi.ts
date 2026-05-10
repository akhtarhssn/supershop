import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) query.append(key, value.toString());
          });
        }
        return `/products?${query.toString()}`;
      },
      providesTags: ['Products'],
    }),
    getSingleProduct: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getMyProducts: builder.query<any, void>({
      query: () => '/products/my-products',
      providesTags: ['Products'],
    }),
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Products', { type: 'Products', id }],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useGetMyProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
