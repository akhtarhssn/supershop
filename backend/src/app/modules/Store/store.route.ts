import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { StoreControllers } from './store.controller';
import { StoreValidation } from './store.validation';
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
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseBodyData,
  validateRequest(StoreValidation.createStoreValidationSchema),
  StoreControllers.createStore,
);

router.get('/', StoreControllers.getAllStores);

router.get('/my-store', auth(USER_ROLE.seller), StoreControllers.getMyStore);

router.get('/:id', StoreControllers.getSingleStore);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  parseBodyData,
  validateRequest(StoreValidation.updateStoreValidationSchema),
  StoreControllers.updateStore,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  StoreControllers.deleteStore,
);

export const StoreRoutes = router;
