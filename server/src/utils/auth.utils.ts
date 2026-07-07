// src/utils/auth.utils.ts
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { ACCESS_JWT_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '#config';
import { RefreshToken } from '#models';

export async function createTokens(userId: string, roles: string[]) {
  const accessToken = jwt.sign({ roles }, ACCESS_JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: userId
  });

  const refreshToken = randomUUID();
  console.log('creating token for userId:', userId);
  const created = await RefreshToken.create({ token: refreshToken, userId });
  console.log('created:', created);

  return { accessToken, refreshToken };
}

export function setAuthCookie(res: Response, refreshToken: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction,
    maxAge: REFRESH_TOKEN_TTL * 1000
  });
}
