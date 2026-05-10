import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
