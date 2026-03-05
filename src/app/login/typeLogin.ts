export interface LoginUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface LoginData {
  token: string;
  user: LoginUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginBody {
  email: string;
  password: string;
}