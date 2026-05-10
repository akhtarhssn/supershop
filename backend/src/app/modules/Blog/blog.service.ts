import { Blog } from './blog.model';
import { IBlog } from './blog.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createBlog = async (payload: IBlog) => {
  return await Blog.create(payload);
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(['title', 'content', 'author', 'tags'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();

  return { result, meta };
};

const getSingleBlog = async (id: string) => {
  return await Blog.findById(id);
};

const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  return await Blog.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBlog = async (id: string) => {
  return await Blog.findByIdAndDelete(id);
};

export const BlogServices = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
