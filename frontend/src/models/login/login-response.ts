import { UserResponse } from "../user/user-response";

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: UserResponse;
}