import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  id: number;
  nombre: string;
  roleName: string;
}

export interface LoginData {
  token: string;
  user: UserLoginResponse;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

const API_URL = "http://localhost:3001/api";
const AUTH_URL = "auth";
const BASE_URL_AUTH = `${API_URL}/${AUTH_URL}`;

export const loginUser = async (
  data: LoginPayload
): Promise<ApiResponse<LoginData>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/login`, data);
  return response.data;
};
