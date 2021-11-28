import { UserModel } from '../../models/user.model';
export interface User {
  first_name: string;
  last_name: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type VacationFollowStat = {
  id: number;
  title: string;
  follows: number;
};

export type LoginParams = { username?: string; password?: string };

export type UserAuth = {
  accessToken: "string";
  accessTokenExpiration: number;
  userDetails: Omit<UserModel, "username" | "password">;
};
