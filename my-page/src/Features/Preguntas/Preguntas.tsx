import { useEffect, useState } from 'react';
import {
  getTestPreguntas,
  getTestRespuestas,
  enviarTestRespuestas,
  TestPersonality,
  RespuestasTestPersonality,
  RespuestaUsuarioTest,
} from './api';

import ResultadoMBTI from './ResultadoMBTI';

interface SelectedAnswer {
  respuestaId: number;
  puntaje: number;
}

const MBTIQuestionPage = () => {
  const [preguntas, setPreguntas] = useState<TestPersonality[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestasTestPersonality[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: SelectedAnswer }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  // const [descripcion, setDescripcion] = useState<string | null>(null);
  // const [keywords, setKeywords] = useState<string | null>(null);
  const [categoriaActualIndex, setCategoriaActualIndex] = useState(0);
  const [mostrarModalResultado, setMostrarModalResultado] = useState(false);
const [datosResultado, setDatosResultado] = useState<{
  tipoMBTI: string;
  personalidad: string;
  descripcion: string;
  keywords: string;
} | null>(null);


  useEffect(() => {
    cargarPreguntas();
    cargarRespuestas();
  }, []);

  const cargarPreguntas = async () => {
    setLoading(true);
    try {
      const res = await getTestPreguntas();
      if (res.isSuccess) {
        setPreguntas(res.data);
      } else {
        setError(res.message || "Error al obtener preguntas");
      }
    } catch {
      setError("Error de red al obtener preguntas");
    } finally {
      setLoading(false);
    }
  };

  const cargarRespuestas = async () => {
    try {
      const res = await getTestRespuestas();
      if (res.isSuccess) {
        setRespuestas(res.data);
      } else {
        setError(res.message || "Error al obtener respuestas");
      }
    } catch {
      setError("Error de red al obtener respuestas");
    }
  };

  const handleSelect = (questionId: number, respuestaId: number, puntaje: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { respuestaId, puntaje },
    }));
  };

  const getCircleStyle = (value: number, selected: boolean) => {
    const sizeMap = {
      2: 'w-16 h-16',
      1: 'w-12 h-12',
      0: 'w-10 h-10',
      '-1': 'w-12 h-12',
      '-2': 'w-16 h-16',
    };
    const baseClass = `rounded-full border-4 flex items-center justify-center transition-transform duration-200 overflow-hidden shadow-lg bg-white`;
    const sizeClass = sizeMap[value as keyof typeof sizeMap] || 'w-10 h-10';
    const ringClass = selected ? ' scale-105 border-[#EB4B15]' : ' border-gray-300';
    return `${baseClass} ${sizeClass} ${ringClass}`;
  };

  const getFaceUrl = (value: number) => {
    switch (value) {
      case 2: return "https://i.ibb.co/hxp3m422/happy.png";
      case 1: return "https://i.ibb.co/G4Wx52t2/smile.png";
      case 0: return "https://i.ibb.co/DfWyDM0z/confused.png";
      case -1: return "https://i.ibb.co/BVJKw26B/sad-3.png";
      case -2: return "https://i.ibb.co/Mydqjr61/angry-3.png";
      default: return "https://cdn-icons-png.flaticon.com/512/6141/6141082.png";
    }
  };

  const preguntasPorCategoria = preguntas.reduce((acc, pregunta) => {
    if (!acc[pregunta.categoria]) acc[pregunta.categoria] = [];
    acc[pregunta.categoria].push(pregunta);
    return acc;
  }, {} as Record<string, TestPersonality[]>);

  const categorias = Object.keys(preguntasPorCategoria);
  const categoriaActual = categorias[categoriaActualIndex];
  const preguntasCategoria = preguntasPorCategoria[categoriaActual] || [];

 const enviarRespuestas = async () => {
  const idUsuarioTest = localStorage.getItem("idUsuarioTest");
  if (!idUsuarioTest) {
    setError("ID del test no encontrado.");
    return;
  }

  // Validación previa
  const preguntasSinResponder = preguntas.filter(p => !answers[p.id]);
  if (preguntasSinResponder.length > 0) {
    alert("Debes responder todas las preguntas antes de continuar.");
    return;
  }

  const payload: RespuestaUsuarioTest[] = preguntas.map((pregunta) => ({
    
    id: 0,
    idUsuarioTest: parseInt(idUsuarioTest),
    idRespuesta: answers[pregunta.id].respuestaId,
    idPregunta: pregunta.id,
    idCategoria: pregunta.categoriaPreguntasId,
    isActive: true,
  }));
  
  try {
    const res = await enviarTestRespuestas(payload);
    if (res.isSuccess) {
      setDatosResultado(res.data);
      setMostrarModalResultado(true);
      localStorage.setItem("testCompleted", "true");
      // window.location.reload();

    
    } else {
      setError(res.message || "Error al enviar el test.");
    }
    console.log("Payload enviado:", payload)
  } catch (err) {
    console.error("Error al enviar respuestas:", err);
    setError("Error al conectar con el servidor.");
  }
};

 return (
  <div className="min-h-screen bg-white px-4 py-10 max-w-4xl mx-auto overflow-y-auto">
    <h1 className="text-4xl font-bold text-center text-black mb-12">Test de Personalidad MBTI</h1>

    {loading && <p className="text-center text-gray-600">Cargando preguntas...</p>}
    {error && <p className="text-center text-red-600">{error}</p>}

    {!loading && !error && respuestas.length > 0 && (
      <div key={categoriaActual} className="mb-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#EB4B15]">{categoriaActual}</h2>
        {preguntasCategoria.map((pregunta) => (
          <div key={pregunta.id} className="mb-12">
            <p className="text-xl font-semibold text-center text-black mb-6">{pregunta.pregunta}</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {respuestas
                .sort((a, b) => b.puntaje - a.puntaje)
                .map((opcion) => (
                  <div key={opcion.id} className="flex flex-col items-center w-24">
                    <button
                      onClick={() => handleSelect(pregunta.id, opcion.id, opcion.puntaje)}
                      className={getCircleStyle(opcion.puntaje, answers[pregunta.id]?.respuestaId === opcion.id)}
                    >
                      <img
                        src={getFaceUrl(opcion.puntaje)}
                        alt={`respuesta ${opcion.puntaje}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                    <span className="text-sm mt-2 text-center text-gray-700">{opcion.nombre}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    )}

    <div className="flex justify-between mt-8">
      <button
        disabled={categoriaActualIndex === 0}
        onClick={() => setCategoriaActualIndex((i) => i - 1)}
        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full disabled:opacity-50"
      >
        Anterior
      </button>

      {categoriaActualIndex === categorias.length - 1 ? (
        <button
          onClick={enviarRespuestas}
          className="px-6 py-2 bg-[#EB4B15] text-white rounded-full hover:bg-orange-600"
        >
          Enviar respuestas
        </button>
      ) : (
        <button
          onClick={() => setCategoriaActualIndex((i) => i + 1)}
          className="px-6 py-2 bg-[#EB4B15] text-white rounded-full hover:bg-orange-600"
        >
          Siguiente
        </button>
      )}
    </div>

    {/* MODAL DE RESULTADO */}
   <ResultadoMBTI
  open={mostrarModalResultado}
  resultado={datosResultado}
  onClose={() => {
    setMostrarModalResultado(false);
    window.location.reload(); // recarga la página al cerrar el modal
  }}
/>

  </div>
);

};

export default MBTIQuestionPage;
