import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import Preguntas from '../Preguntas/Preguntas';
import { postUsuarioTest, verificarTestPendiente,  } from '../Preguntas/api';


const MBTITestPage = () => {
  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testCompletado, setTestCompletado] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const verificarEstado = () => {
      const testCompletadoStorage = localStorage.getItem("testCompleted") === "true";
      const idUsuarioTest = localStorage.getItem("idUsuarioTest");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setMensajeError('Usuario no autenticado');
        return;
      }

      // Primera verificación rápida con localStorage
      if (testCompletadoStorage) {
        setTestCompletado(true);
        // Limpiar idUsuarioTest si existe (por si acaso)
        if (idUsuarioTest) {
          localStorage.removeItem("idUsuarioTest");
        }
        return;
      }

      // Si hay idUsuarioTest pero no está marcado como completado
      if (idUsuarioTest) {
        setMostrarPreguntas(true);
      }
    };

    verificarEstado();
  }, []);


  const chequearTestExistente = async () => {
  const idUsuario = parseInt(localStorage.getItem("userId") || "0");

  const check = await verificarTestPendiente(idUsuario);

  if (check.isSuccess && check.data?.idUsuarioTest) {
    localStorage.setItem("idUsuarioTest", check.data.idUsuarioTest.toString());
    setMostrarPreguntas(true);
  } else {
    iniciarTest(); // aquí llamas tu función original SIN modificarla
  }
};


  const iniciarTest = async () => {
    if (loading) return;
    
    // Verificación adicional por si acaso
    if (localStorage.getItem("testCompleted") === "true") {
      setTestCompletado(true);
      setMensajeError('Ya has completado este test anteriormente');
      return;
    }

    try {
      setLoading(true);
      const idUsuario = parseInt(localStorage.getItem('userId') || '0');
      const tipoTestId = 1;

      const res = await postUsuarioTest({ idUsuario, tipoTestId });

      if (res.isSuccess) {
        const idUsuarioTest = res.data?.idUsuarioTest;
        if (idUsuarioTest) {
          localStorage.setItem("idUsuarioTest", idUsuarioTest.toString());
          setMostrarPreguntas(true);
        }
      } else {
        setMensajeError(res.message || 'No se pudo iniciar el test');
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 409) {
        setMensajeError('Tienes un test en progreso. Por favor complétalo primero.');
        setMostrarPreguntas(true);
      } else {
        setMensajeError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/742/742751.png",
      alt: "Feliz",
      text: "Sé tú mismo y responde con sinceridad para averiguarlo",
      bgColor: "bg-[#EB4B15]",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/709/709592.png",
      alt: "Búsqueda",
      text: "Descubre cómo tu personalidad influye en todas las áreas de tu vida",
      bgColor: "bg-[#E5E5E5]",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
      alt: "Avatar",
      text: "Conviértete en quien deseas ser con nuestros recursos adicionales",
      bgColor: "bg-black",
    },
  ];

  if (mostrarPreguntas) {
    return <Preguntas onTestCompletado={() => {
      setTestCompletado(true);
      setMostrarPreguntas(false);
      localStorage.setItem("testCompleted", "true");
      localStorage.removeItem("idUsuarioTest");
    }} />;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center px-4 py-10">
      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-black"
      >
        Realizar Test de Personalidad MBTI
      </Motion.h1>

      <p className="text-center text-black max-w-xl mt-4">
        El MBTI es una herramienta de autoconocimiento que te ayuda a entender tu personalidad
        y mejorar tus relaciones personales y profesionales.
      </p>

      <p className="text-sm text-[#EB4B15] mt-2">Paso 1 de 4 • Tiempo estimado: 5 minutos</p>
      <p className="text-sm text-[#EB4B15] mt-2">Debes completar test para poder visualizar el tets y las ofertas</p>

      <div className="mt-10 grid gap-8 md:grid-cols-3 w-full max-w-6xl">
        {features.map((item, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`rounded-xl p-4 hover:shadow-xl transition-transform hover:scale-105 text-center cursor-pointer ${item.bgColor}`}
          >
            <img src={item.img} alt={item.alt} className="w-40 h-40 mx-auto mb-4" />
            <p className="text-base font-medium text-white">{item.text}</p>
          </Motion.div>
        ))}
      </div>

      <Motion.button
        whileHover={!testCompletado ? { scale: 1.05 } : {}}
        whileTap={!testCompletado ? { scale: 0.95 } : {}}
        disabled={loading || testCompletado}
        className={`mt-12 ${
          testCompletado ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#EB4B15] hover:bg-orange-600'
        } text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200`}
        onClick={chequearTestExistente}
      >
        {testCompletado ? (
          "Test Completado"
        ) : loading ? (
          "Iniciando..."
        ) : (
          <>
            ¡Comenzar ahora! <ArrowRight size={18} />
          </>
        )}
      </Motion.button>

      {testCompletado && (
        <p className="mt-4 text-red-500 text-center">
          Ya has completado este test. No puedes realizarlo nuevamente.
        </p>
      )}

      {mensajeError && !testCompletado && (
        <p className="mt-4 text-red-500 text-center">{mensajeError}</p>
      )}
    </div>
  );
};

export default MBTITestPage;
