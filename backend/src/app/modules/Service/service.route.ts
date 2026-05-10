import { Router } from 'express';
import { ServiceControllers } from './service.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth('superAdmin', 'admin'), ServiceControllers.createService);
router.get('/', ServiceControllers.getAllServices);
router.get('/:id', ServiceControllers.getSingleService);
router.put('/:id', auth('superAdmin', 'admin'), ServiceControllers.updateService);
router.delete('/:id', auth('superAdmin', 'admin'), ServiceControllers.deleteService);

export const ServiceRoutes = router;
