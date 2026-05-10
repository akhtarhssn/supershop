import { Router } from 'express';
import { BlogControllers } from './blog.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth('superAdmin', 'admin'), BlogControllers.createBlog);
router.get('/', BlogControllers.getAllBlogs);
router.get('/:id', BlogControllers.getSingleBlog);
router.put('/:id', auth('superAdmin', 'admin'), BlogControllers.updateBlog);
router.delete('/:id', auth('superAdmin', 'admin'), BlogControllers.deleteBlog);

export const BlogRoutes = router;
