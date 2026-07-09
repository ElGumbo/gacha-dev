import { Router } from 'express';
import { pull } from '#controllers';
import { authenticate, validateParams } from '#middleware';
import { idParamSchema } from '#schemas';

const bannerRoutes = Router();

bannerRoutes.post('/:id/pull', authenticate, validateParams(idParamSchema), pull);

export default bannerRoutes;
