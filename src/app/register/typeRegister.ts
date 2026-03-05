interface RegisterResponseError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterResponseError[];
}

export interface RegisterBody {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}