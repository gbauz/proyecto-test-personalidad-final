import axios from "axios";
import { ApiResponse } from "../Auth/api";

export interface TestPersonality {
  id: number;
  pregunta: string;
  categoriaPreguntasId: number;
  categoria: string;
  ordenCategoria: number;
}

export interface RespuestasTestPersonality {
  id: number;
  nombre: string;
  puntaje: number;
  isActive: boolean;
}



export interface crearTest {
  idUsuario: number,
  tipoTestId: number,
}


export interface idUsuarioTestInterface {
  idUsuario: number,
}

export interface RespuestaUsuarioTest {
  id: number;
  idUsuarioTest: number;
  idRespuesta: number;
  idPregunta: number;
  idCategoria: number;
  isActive: boolean;
}

export interface ResultadoTestMBTI {
  tipoMBTI: string;
  personalidad: string;
  descripcion: string;
  keywords: string;
}

export interface SelectedAnswer {
  respuestaId: number;
  puntaje: number;
}


export interface TestCompletado {
  id: number;
  idDicotomia: number;
  idUsuarioTest: number;
  isActive: boolean;
  createdAt: string;
  personalidades: {
    id: number;
    nombre: string;
    keywords: string;
    descripcion: string;
    isActive: boolean;
  };
  usuariotest: {
    id: number;
    idUsuario: number;
    tipoTestId: number;
    codigo: string;
    isActive: boolean;
    testCompleted: boolean;
    user: {
      id: number;
      name: string;
      email: string;
      roleId: number;
      isActive: boolean;
    };
  };
}


export interface FiltrosTestCompletado {
  idUsuario?: number;
  personalidad?: string;
  desde?: string; // formato: 'YYYY-MM-DD'
  hasta?: string;
  nombre?: string;
}


const BASE_URL_TEST = "http://localhost:3001/api";
const TEST_URL = "test";
export const VER_TEST_URL_API = `${BASE_URL_TEST}/${TEST_URL}`;


export const getTestPreguntas = async (): Promise<ApiResponse<TestPersonality[]>> => {
  const response = await axios.get(`${VER_TEST_URL_API}/get`);
  return response.data;
};

export const obtenerTestsCompletados = async (
  filtros: FiltrosTestCompletado
): Promise<ApiResponse<TestCompletado[]>> => {
  const params = new URLSearchParams();

  if (filtros.idUsuario) params.append("idUsuario", filtros.idUsuario.toString());
  if (filtros.personalidad) params.append("personalidad", filtros.personalidad);
  if (filtros.desde) params.append("desde", filtros.desde);
  if (filtros.hasta) params.append("hasta", filtros.hasta);
  if (filtros.nombre) params.append("nombre", filtros.nombre);

  const response = await axios.get(`${BASE_URL_TEST}/${TEST_URL}/completados?${params.toString()}`);
 
  return response.data;

};

export const getTestRespuestas = async (): Promise<ApiResponse<RespuestasTestPersonality[]>> => {
  const response = await axios.get(`${VER_TEST_URL_API}/getRespuestasActivas`);
  return response.data;
}

export const postUsuarioTest = async (data: crearTest): Promise<ApiResponse<idUsuarioTestInterface>> => {
  const response = await axios.post(`${VER_TEST_URL_API}/crearTest`, data);
   console.log("Respuesta crearTest:", response.data.data); // 
  return response.data;
};




export const enviarTestRespuestas = async (
  respuestas: RespuestaUsuarioTest[]
): Promise<ApiResponse<ResultadoTestMBTI>> => {
  const response = await axios.post(`${VER_TEST_URL_API}/llenarTest`, respuestas);
     console.log("Respuesta crearTest:", response.data.data); // 
  return response.data;
};

export const verificarTestPendiente = async (idUsuario: number) => {
  const response = await axios.get(`${VER_TEST_URL_API}/verificar-pendiente/${idUsuario}`);
  return response.data;
};
