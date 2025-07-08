import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { fetchPerfilByUserId } from '../Auth/apiPerfil';
import { fetchUsuarios, Usuario , } from './apiUsuarios';
import { marcarValidacion, obtenerOfertasParaPostulante, verificarTestCompletado , marcarAprobacion} from '../Auth/apiOfertas';
import { obtenerTestsCompletados ,TestCompletado  } from '../Preguntas/api';



interface Oferta {
  id: number;
  nombre: string;
  descripcion: string;
  sueldo: number;
  modalidad: string;
  creadoEn: string;
  creador?: {
    name?: string;
  };
  postulaciones?: any[]; // Asegúrate de que esté tipado si puedes
}

interface PostulanteDetalleProps {
  nombre: string;
  fotoPerfil: string;
  postulanteId: number;
  onFinalizar: () => void;
}

const PostulanteDetalle: React.FC<PostulanteDetalleProps> = ({ nombre, fotoPerfil, postulanteId,
onFinalizar }) => {
  const [curriculumUrl, setCurriculumUrl] = useState('');

   const [mensaje, setMensaje] = useState('');
  const [testCompletado, setTestCompletado] = useState<TestCompletado | null>(null);
  const [loading, setLoading] = useState(true);

 const manejarAprobacion = async () => {
  try {
    await marcarAprobacion(postulanteId, "ACEPTADA"); // ✅ Estado correcto
    setMensaje('✅ La solicitud fue aprobada.');
  } catch (error) {
    
    setMensaje('❌ EL Usuario no tiene postulaciones .');
  } finally {
    setTimeout(onFinalizar, 2000); // Regresa después de 2 segundos
  }
};

const manejarRechazo = async () => {
  try {
    await marcarAprobacion(postulanteId, "RECHAZADA"); // ✅ Estado correcto
    setMensaje('❌ La solicitud fue rechazada.');
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    setMensaje('❌ Error al rechazar la solicitud.');
  } finally {
    setTimeout(onFinalizar, 2000); // Regresa después de 2 segundos
  }
};



  useEffect(() => {
  const cargarDatos = async () => {
    try {
      // Obtener test completado
      const res = await obtenerTestsCompletados({ idUsuario: postulanteId });
      if (res.isSuccess && res.data.length > 0) {
        setTestCompletado(res.data[0]);
      }

      // Obtener perfil y CV
      const perfilRes = await fetchPerfilByUserId(postulanteId);
      if (perfilRes.isSuccess && perfilRes.data?.curriculum) {
        const url = `http://localhost:3001/${perfilRes.data.curriculum.replace(/\\/g, '/')}`;
        setCurriculumUrl(url);
      }
    } catch (error) {
      console.error('Error cargando datos del postulante:', error);
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
}, [postulanteId]);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
    <div className="flex items-center space-x-4 mb-6">
      {fotoPerfil ? (
        <img
          src={fotoPerfil}
          alt={nombre}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium border border-gray-300">
          Sin foto
        </div>
      )}
   {curriculumUrl ? (
<button
  onClick={async () => {
    try {
      // 1. Validar documento en el backend
      await marcarValidacion(postulanteId);
      // 2. Abrir el CV
      window.open(curriculumUrl, '_blank');
    } catch (error) {
      console.error('Error al validar documento:', error);
    }
  }}
  className="text-blue-500 text-sm hover:underline"
>
  Ver CV
</button>
) : (
  <span className="text-gray-400 text-sm">CV no disponible</span>
)}

      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Resultados del Test</h3>

        {loading ? (
          <p className="text-gray-600">Cargando resultados...</p>
        ) : testCompletado ? (
          <>
            <p className="text-sm text-gray-700 mb-2">
  Tipo de personalidad: {testCompletado.personalidades?.nombre || 'No definido'}
</p>
<p className="text-sm text-gray-700 italic mb-2">
  Descripción: {testCompletado.personalidades?.descripcion || 'Sin descripción'}
</p>
<p className="text-sm text-gray-700 italic mb-2">
  Palabras clave: {testCompletado.personalidades?.keywords || 'No definidas'}
</p>
          </>
        ) : (
          <p className="text-gray-600">Este postulante aún no tiene resultados registrados.</p>
        )}
      </div>

  <div className="mt-6">
        <div className="flex justify-between">
          <button
            onClick={manejarAprobacion}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Aceptar aprobación
          </button>

          <button
            onClick={manejarRechazo}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Rechazar aprobación
          </button>
        </div>

        {mensaje && (
          <div className="mt-4 text-center text-sm font-semibold text-gray-700">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

const JobAccordion: React.FC = () => {
 
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [postulantes, setPostulantes] = useState<Usuario[]>([]);
  const [loadingPostulantes, setLoadingPostulantes] = useState(true);
  const [errorPostulantes, setErrorPostulantes] = useState('');
  const [fotosPostulantes, setFotosPostulantes] = useState<{ [userId: number]: string }>({});

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loadingOfertas, setLoadingOfertas] = useState(false);
  const [errorOfertas, setErrorOfertas] = useState('');

  const [postulanteSeleccionado, setPostulanteSeleccionado] = useState<Usuario | null>(null);

  const userIdStr = localStorage.getItem('userId');
  const userId = userIdStr ? Number(userIdStr) : null;

  useEffect(() => {
    if (userId) {
      fetchPerfilByUserId(userId)
        .then(({ isSuccess, data }) => {
          if (isSuccess && data?.fotoPerfil) {
            setFotoPerfil(`http://localhost:3001/${data.fotoPerfil}`);
          }
        })
        .catch(() => {});
    }
  }, [userId]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      if (!userId) return;
      try {
        const res = await fetchUsuarios();
        if (!res.isSuccess) {
          setErrorPostulantes(res.message || "No se pudieron obtener los usuarios.");
          return;
        }

        const candidatos = res.data.filter((u: Usuario) => u.role === 'Postulante');

        const filtrados: Usuario[] = [];
        const fotos: { [userId: number]: string } = {};

        await Promise.all(
          candidatos.map(async (post) => {
            try {
              const haHechoTest = await verificarTestCompletado(post.id);

              if (haHechoTest) {
                filtrados.push(post);
                const perfilRes = await fetchPerfilByUserId(post.id);
                if (perfilRes.isSuccess && perfilRes.data?.fotoPerfil) {
                  fotos[post.id] = `http://localhost:3001/${perfilRes.data.fotoPerfil}`;
                }
              }
            } catch (err) {
              console.warn(`Error verificando test o foto para usuario ${post.name} (${post.id}):`, err);
            }
          })
        );

        setPostulantes(filtrados);
        setFotosPostulantes(fotos);
      } catch {
        setErrorPostulantes("Error al conectar con el servidor.");
      } finally {
        setLoadingPostulantes(false);
      }
    };

    cargarUsuarios();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const cargarOfertas = async () => {
        setLoadingOfertas(true);
        try {
          const res = await obtenerOfertasParaPostulante(userId);
          if (res.isSuccess) {
            setOfertas(res.data ?? []);
          } else {
            setErrorOfertas(res.message || 'No se pudieron cargar las ofertas.');
          }
        } catch (error: any) {
          console.error('Error al conectar con el servidor:', error.response?.data || error.message);
          setErrorOfertas(error.response?.data?.message || 'Error al conectar con el servidor.');
        } finally {
          setLoadingOfertas(false);
        }
      };
      cargarOfertas();
    }
  }, [userId]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-4">
      {!postulanteSeleccionado ? (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200">
            <div
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setOpenIndex(openIndex === 'postulantes' ? null : 'postulantes')}
            >
              <h2 className="text-xl font-bold text-gray-800">Postulantes</h2>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 border">
                  {loadingPostulantes ? "..." : postulantes.length}
                </div>
                {openIndex === 'postulantes' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {openIndex === 'postulantes' && (
              <div className="px-6 pb-6 space-y-6">
                {loadingPostulantes ? (
                  <p className="text-gray-600">Cargando postulantes...</p>
                ) : errorPostulantes ? (
                  <p className="text-red-500">{errorPostulantes}</p>
                ) : postulantes.length === 0 ? (
                  <p className="text-gray-700">No hay postulantes registrados.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {postulantes.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl border shadow p-4 flex flex-col items-center text-center"
                      >
                       {fotosPostulantes[p.id] ? (
  <img
    src={fotosPostulantes[p.id]}
    alt={p.name}
    className="w-20 h-20 rounded-full object-cover mb-3 border border-gray-300"
  />
) : (
  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium mb-3">
    Sin foto
  </div>
)}

                        <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                        <button
                          onClick={() => setPostulanteSeleccionado(p)}
                          className="mt-3 text-xs text-blue-600 hover:underline font-medium"
                        >
                          Ver Postulación
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-left text-gray-800 mb-12 mt-6">
            Postulantes por <span className="text-[#EA4711]">Ofertas Creadas</span>
          </h1>

          {loadingOfertas ? (
            <p className="text-gray-600">Cargando ofertas...</p>
          ) : errorOfertas ? (
            <p className="text-red-500">{errorOfertas}</p>
          ) : ofertas.length === 0 ? (
            <p className="text-gray-700">No hay ofertas creadas aún.</p>
          ) : (
            ofertas.map(oferta => (
              <div key={oferta.id} className="bg-white rounded-2xl shadow-md border border-gray-200">
                <div
                  className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setOpenIndex(openIndex === `oferta-${oferta.id}` ? null : `oferta-${oferta.id}`)}
                >
                  <h2 className="text-xl font-bold text-gray-800">{oferta.nombre}</h2>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 border">
                      {oferta.postulaciones?.length ?? 0}
                    </div>
                    {openIndex === `oferta-${oferta.id}` ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

            {openIndex === `oferta-${oferta.id}` && (
  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {oferta.postulaciones
      ?.filter(p => p.postulante)
      .map(postu => {
        const cand = postu.postulante;
        const fotoUrl = cand.perfil?.fotoPerfil
          ? `http://localhost:3001/${cand.perfil.fotoPerfil.replace(/\\/g, '/')}`
          : '';
        return (
          <div
            key={postu.id}
            className="bg-white rounded-xl border shadow p-4 flex flex-col items-center text-center"
          >
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={cand.name}
                className="w-20 h-20 rounded-full object-cover mb-3 border border-gray-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium mb-3 border border-gray-300">
                Sin foto
              </div>
            )}
            <h3 className="text-sm font-semibold text-gray-800">{cand.name}</h3>
            <button
              onClick={() => setPostulanteSeleccionado(cand)}
              className="mt-2 text-xs text-blue-600 hover:underline font-medium"
            >
              Ver Postulación
            </button>
          </div>
        );
      })}
  </div>
)}
</div>
))
)}
</>
) : (
  <div>
    <button
      onClick={() => setPostulanteSeleccionado(null)}
      className="text-blue-600 mb-4 hover:underline text-sm"
    >
      ← Volver a la lista de postulantes
    </button>
    <PostulanteDetalle
      nombre={postulanteSeleccionado.name}
      fotoPerfil={fotosPostulantes[postulanteSeleccionado.id] || ''}
      postulanteId={postulanteSeleccionado.id}
      onFinalizar={() => setPostulanteSeleccionado(null)}
    />
  </div>
)}
</div>
)
};

export default JobAccordion;
