export interface IBlog {
  title: string;
  content: string;
  author: string;
  image: string;
  tags?: string[];
  status: 'Published' | 'Draft';
}
