import { Router } from 'express';
import { BrandControllers } from './brand.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth('superAdmin', 'admin'), BrandControllers.createBrand);
router.get('/', BrandControllers.getAllBrands);
router.get('/:id', BrandControllers.getSingleBrand);
router.put('/:id', auth('superAdmin', 'admin'), BrandControllers.updateBrand);
router.delete('/:id', auth('superAdmin', 'admin'), BrandControllers.deleteBrand);

export const BrandRoutes = router;
