import axios from "axios";

export interface OfertaPayload {
  nombre: string;
  descripcion: string;
  sueldo: number;
  modalidad: string;
  creadorId: number;
}
export interface FechaPostulacion {
  fecha: string;
  createdAt: string;
  postulante: {
    name: string;
  };
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

const API_URL = "http://localhost:3001/api";
const AUTH_URL = "auth";
const BASE_URL_AUTH = `${API_URL}/${AUTH_URL}`;

export const crearOferta = async (
  data: OfertaPayload
): Promise<ApiResponse<null>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/crearoferta`, data);
  return response.data;
};

export const obtenerOfertasParaPostulante = async (
  userId: number
): Promise<ApiResponse<any[]>> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL_AUTH}/verofertas`, {
    params: { userId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const postularAOferta = async (
  ofertaId: number,
  postulanteId: number
): Promise<ApiResponse<any>> => {
  const response = await axios.post(`${BASE_URL_AUTH}/postular`, {
    ofertaId,
    postulanteId,
  });

  return response.data;
};

export const verificarPostulacion = async (
  postulanteId: number
): Promise<{ isSuccess: boolean; yaPostulado: boolean }> => {
  const response = await axios.get(`${BASE_URL_AUTH}/verificarpostulacion`, {
    params: { postulanteId },
  });
  return response.data;
};



export const verificarTestCompletado = async (
  userId: number
): Promise<boolean> => {
  try {
   const response = await axios.get(`${API_URL}/test/usuarios-con-test`);


    // Verificamos si el usuario aparece en la lista de usuarios con test completado
    const usuariosConTest = response.data.data || [];

    const usuarioEncontrado = usuariosConTest.some(
      (usuario: any) => usuario.id === userId
    );

    return usuarioEncontrado;
  } catch (error) {
    console.error("Error al verificar test:", error);
    return false;
  }
};


export const obtenerFechasConUsuario = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL_AUTH}/fechas-con-usuario/${userId}`);
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener fechas por usuario:', error);
    return [];
  }
};


// ✅ Validar documento
export const marcarValidacion = async (postulacionId: number) => {
  const res = await axios.put(`${BASE_URL_AUTH}/postulacion/validar/${postulacionId}`);
  
  return res.data;
};

// ✅ Aprobar solicitud
// export const marcarAprobacion = async (postulacionId: number) => {
//   const res = await axios.put(`${BASE_URL_AUTH}/postulacion/aprobar/${postulacionId}`);
 
//   return res.data;
// };

// ✅ Aprobar o rechazar solicitud
// ✅ Aprobar o rechazar solicitud
export const marcarAprobacion = async (postulacionId: number, estadoAprobacion: "ACEPTADA" | "RECHAZADA") => {
  const res = await axios.put(`${BASE_URL_AUTH}/postulacion/aprobar/${postulacionId}`, {
    estadoAprobacion,
  });

  return res.data;
};
