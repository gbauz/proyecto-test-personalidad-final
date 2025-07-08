import axios from "axios";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface DeleteUserPayload {
  id: number;
  roleId?: number;
}

export interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
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

export const fetchUsuarios = async (): Promise<ApiResponse<Usuario[]>> => {
  const response = await axios.get(`${BASE_URL_AUTH}/consultarusuarios`);
  return response.data;
};

export const fetchRoles = async (): Promise<ApiResponse<RoleOption[]>> => {
  const response = await axios.get(`${BASE_URL_AUTH}/roles`);
  return response.data;
};

export const updateUsuarioStructured = async (
  data: UpdateUserPayload
): Promise<ApiResponse<Usuario>> => {
  const response = await axios.post(
    `${BASE_URL_AUTH}/consultarusuarios/update`,
    data
  );
  return response.data;
};

export const deleteUsuarioStructured = async (
  data: DeleteUserPayload
): Promise<ApiResponse<null>> => {
  const response = await axios.post(
    `${BASE_URL_AUTH}/consultarusuarios/delete`,
    data
  );
  return response.data;
};
