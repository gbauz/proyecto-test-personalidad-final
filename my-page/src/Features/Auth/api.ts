import axios from 'axios';

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


export interface OfertaPayload {
  nombre: string;
  descripcion: string;
  sueldo: number;
  modalidad: string;
  creadorId: number;
}



// NUEVA interfaz genérica para todas las respuestas del backend
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

const API_URL = "http://localhost:3001/api";
const AUTH_URL = "auth";
const BASE_URL_AUTH = `${API_URL}/${AUTH_URL}`;

export const loginUser = async (data: LoginPayload): Promise<ApiResponse<LoginData>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/login`, data);
  return response.data;
};

export const fetchUsuarios = async (): Promise<ApiResponse<Usuario[]>> => {
  const response = await axios.get(`${BASE_URL_AUTH}/consultarusuarios`);
  return response.data;
};


export const registerUser = async (data: RegisterPayload): Promise<ApiResponse<null>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/register`, data);
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


export const crearOferta = async (
  data: OfertaPayload
): Promise<ApiResponse<null>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/crearoferta`, data);
  return response.data;
};


export const obtenerOfertasParaPostulante = async (
  userId: number
): Promise<ApiResponse<any[]>> => {
  const response = await axios.get(`${BASE_URL_AUTH}/verofertas`, {
    params: { userId },
  });
  return response.data;
};
