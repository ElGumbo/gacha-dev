export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthSuccessResponse {
  message: string;
  accessToken: string;
}

export interface MeResponse {
  message: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
