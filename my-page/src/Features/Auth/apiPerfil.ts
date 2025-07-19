import axios from "axios";

export interface Perfil {
  userId: number;
  cedula: string;
  sexo: string;
  pais: string;
  ciudad: string;
  fotoPerfil?: string;
  curriculum?: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

const API_URL = "http://localhost:3001/api/auth";  // Aquí el prefijo 'auth' según tu server.js

// Obtener perfil por userId
export const fetchPerfilByUserId = async (
  userId: number
): Promise<ApiResponse<Perfil | null>> => {
  const response = await axios.get(`${API_URL}/perfil/${userId}`);
  return response.data;
};

// Actualizar perfil con formulario multipart/form-data
export const updatePerfil = async (
  formData: FormData
): Promise<ApiResponse<Perfil>> => {
  const response = await axios.post(`${API_URL}/perfil/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

