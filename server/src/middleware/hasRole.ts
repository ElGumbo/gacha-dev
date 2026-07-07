import type { RequestHandler } from 'express';

const hasRole = (...allowedRoles: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) return next(new Error('Unauthorized', { cause: { status: 401 } }));

    const { roles: userRoles } = req.user;

    if (userRoles.includes('admin') || userRoles.some(role => allowedRoles.includes(role))) {
      return next();
    }

    next(new Error('Forbidden', { cause: { status: 403 } }));
  };
};

export default hasRole;