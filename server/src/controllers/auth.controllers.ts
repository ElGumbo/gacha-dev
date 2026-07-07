import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import type { z } from 'zod';
import type { Types } from 'mongoose';
import { ACCESS_JWT_SECRET, SALT_ROUNDS } from '#config';
import { User, RefreshToken } from '#models';
import { createTokens, setAuthCookie } from '#utils';
import { registerSchema, loginSchema } from '#schemas';

type RegisterBody = z.output<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;

interface MessageResponse {
  message: string;
}

interface UserDTO {
  _id: InstanceType<typeof Types.ObjectId>;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

type AuthSuccessResponse = MessageResponse & { accessToken: string };
type MeResponse = MessageResponse & { user: UserDTO };

interface AccessTokenPayload extends jwt.JwtPayload {
  roles: string[];
}

export const register: RequestHandler<unknown, AuthSuccessResponse, RegisterBody> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password, ...rest } = req.body;

    const existing = await User.exists({ email });
    if (existing)
      throw new Error('A user with that email already exists.', { cause: { status: 409 } });

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPW = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashedPW, ...rest });

    const { accessToken, refreshToken } = await createTokens(user._id.toString(), user.roles);
    setAuthCookie(res, refreshToken);

    res.status(201).json({ message: 'Registration successful.', accessToken });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const login: RequestHandler<unknown, AuthSuccessResponse, LoginBody> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').lean();
    if (!user) throw new Error('Invalid email or password.', { cause: { status: 401 } });

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid email or password.', { cause: { status: 401 } });

    await RefreshToken.deleteMany({ userId: user._id });

    const { accessToken, refreshToken } = await createTokens(user._id.toString(), user.roles);
    setAuthCookie(res, refreshToken);

    res.json({ message: 'Login successful.', accessToken });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const refresh: RequestHandler<unknown, AuthSuccessResponse> = async (req, res, next) => {
  try {
    const { refreshToken: oldRefreshToken } = req.cookies;

    if (!oldRefreshToken) throw new Error('No refresh token provided.', { cause: { status: 401 } });

    const stored = await RefreshToken.findOne({ token: oldRefreshToken }).lean();
    if (!stored) throw new Error('Invalid or expired refresh token.', { cause: { status: 403 } });

    await RefreshToken.findByIdAndDelete(stored._id);

    const user = await User.findById(stored.userId).lean();
    if (!user) throw new Error('User not found.', { cause: { status: 403 } });

    const { accessToken, refreshToken } = await createTokens(user._id.toString(), user.roles);
    setAuthCookie(res, refreshToken);

    res.json({ message: 'Token refreshed.', accessToken });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const logout: RequestHandler<unknown, MessageResponse> = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const me: RequestHandler<unknown, MeResponse> = async (req, res, next) => {
  try {
    const authHeader = req.header('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') && authHeader.split(' ')[1];

    if (!accessToken) throw new Error('Access token is required.', { cause: { status: 401 } });

    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as AccessTokenPayload;

    if (!decoded.sub)
      throw new Error('Invalid or expired access token.', { cause: { status: 403 } });

    const user = await User.findById(decoded.sub).lean();
    if (!user) throw new Error('User not found.', { cause: { status: 404 } });

    res.json({ message: 'Authenticated.', user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error('Expired access token.', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } })
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new Error('Invalid access token.', { cause: { status: 401 } }));
    } else {
      next(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
};
