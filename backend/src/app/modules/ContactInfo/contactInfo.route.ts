import { Router } from 'express';
import { ContactInfoControllers } from './contactInfo.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', ContactInfoControllers.getContactInfo);
router.put('/', auth('superAdmin', 'admin'), ContactInfoControllers.updateContactInfo);

export const ContactInfoRoutes = router;
