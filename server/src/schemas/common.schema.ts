import { z } from 'zod';

export const idParamSchema = z.strictObject({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id.')
});
