import type { RequestHandler } from 'express';
import { z } from 'zod';

const validateParams =
  (zodSchema: z.ZodType): RequestHandler =>
  (req, _res, next) => {
    const { data, error, success } = zodSchema.safeParse(req.params);
    if (!success) {
      next(new Error(z.prettifyError(error), { cause: { status: 400 } }));
    } else {
      req.params = data as typeof req.params;
      next();
    }
  };

export default validateParams;
