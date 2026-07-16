import { Router } from 'express';
import { getBanners, pull } from '#controllers';
import { authenticate, validateParams } from '#middleware';
import { idParamSchema } from '#schemas';

const bannerRoutes = Router();

bannerRoutes.get('/', authenticate, getBanners);

bannerRoutes.post('/:id/pull', authenticate, validateParams(idParamSchema), pull);

export default bannerRoutes;
