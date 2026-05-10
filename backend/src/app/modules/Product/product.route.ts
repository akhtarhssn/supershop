import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { ProductControllers } from './product.controller';
import { ProductValidation } from './product.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageCloudinary';

const parseBodyData = (req: any, res: any, next: any) => {
  if (req.body && req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  next();
};

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array('files', 5),
  parseBodyData,
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProducts);

router.get('/my-products', auth(USER_ROLE.seller), ProductControllers.getMyProductsFromDB);

router.get('/:id', ProductControllers.getSingleProduct);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  upload.array('files', 5),
  parseBodyData,
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
