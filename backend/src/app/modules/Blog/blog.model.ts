import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  },
  {
    timestamps: true,
  }
);

export const Blog = model<IBlog>('Blog', blogSchema);
