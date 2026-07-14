import { Router } from 'express';
import { getCollection, getCollectionEntry } from '#controllers';
import { authenticate, validateParams } from '#middleware';
import { idParamSchema } from '#schemas';

const collectionRoutes = Router();

collectionRoutes.get('/', authenticate, getCollection);

collectionRoutes.get('/:id', authenticate, validateParams(idParamSchema), getCollectionEntry);

export default collectionRoutes;
