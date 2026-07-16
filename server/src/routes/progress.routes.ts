import { Router } from 'express';
import { getProgress } from '#controllers';
import { authenticate } from '#middleware';

const progressRoutes = Router();

progressRoutes.get('/', authenticate, getProgress);

export default progressRoutes;
