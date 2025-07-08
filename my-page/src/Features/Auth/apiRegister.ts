import axios from "axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface RoleOption {
  value: number;
  label: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

const API_URL = "http://localhost:3001/api";
const AUTH_URL = "auth";
const BASE_URL_AUTH = `${API_URL}/${AUTH_URL}`;

export const registerUser = async (
  data: RegisterPayload
): Promise<ApiResponse<null>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/register`, data);
  console.log(response.data)
  return response.data;
};

export const fetchRoles = async (): Promise<ApiResponse<RoleOption[]>> => {
  const response = await axios.get(`${BASE_URL_AUTH}/roles`);
  return response.data;
};

export const fetchUserBasicInfo = async (userId: number): Promise<{ name: string; email: string }> => {
  const response = await axios.get(`${BASE_URL_AUTH}/user/${userId}`);
  return response.data;
};