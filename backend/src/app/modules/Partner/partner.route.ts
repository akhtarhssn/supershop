import { Router } from 'express';
import { PartnerControllers } from './partner.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth('superAdmin', 'admin'), PartnerControllers.createPartner);
router.get('/', PartnerControllers.getAllPartners);
router.get('/:id', PartnerControllers.getSinglePartner);
router.put('/:id', auth('superAdmin', 'admin'), PartnerControllers.updatePartner);
router.delete('/:id', auth('superAdmin', 'admin'), PartnerControllers.deletePartner);

export const PartnerRoutes = router;
