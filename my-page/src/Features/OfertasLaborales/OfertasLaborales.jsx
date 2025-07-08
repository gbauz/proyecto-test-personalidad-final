import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ofertas = [
  {
    id: 1,
    titulo: "Product Designer",
    descripcion:
      "Responsable de diseñar productos digitales centrados en el usuario. Trabaja en UX, UI y estrategia del producto. Herramientas: Figma, Sketch, prototipado, investigación de usuarios.",
    mbti: "ENFP",
    imagen:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    titulo: "UX Researcher",
    descripcion:
      "Enfocado en entender al usuario mediante entrevistas, tests de usabilidad y análisis de datos para mejorar la experiencia. Herramientas: Lookback, Optimal Workshop.",
    mbti: "INFJ",
    imagen:
      "https://images.unsplash.com/photo-1551836022-2b99a476c57c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    titulo: "UI Designer",
    descripcion:
      "Especialista en diseño visual, tipografía, iconografía y animaciones para interfaces atractivas y funcionales. Herramientas: Adobe XD, Figma, Illustrator.",
    mbti: "ISFP",
    imagen:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    titulo: "Interaction Designer",
    descripcion:
      "Diseña las interacciones y flujos entre el usuario y el producto, enfocándose en usabilidad y eficiencia. Herramientas: InVision, Principle.",
    mbti: "INTJ",
    imagen:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    titulo: "Visual Designer",
    descripcion:
      "Centrado en identidad visual, branding y estética general del producto o marca. Herramientas: Photoshop, Illustrator.",
    mbti: "ESFP",
    imagen:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    titulo: "Design System Manager",
    descripcion:
      "Administra y mantiene el sistema de diseño para asegurar consistencia en componentes y estilos. Herramientas: Storybook, documentación.",
    mbti: "ISTJ",
    imagen:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
  },
];

function Postulacion() {
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const abrirModal = (oferta) => {
    setOfertaSeleccionada(oferta);
    setConfirmando(false);
    setExito(false);
  };

  const cerrarModal = () => {
    setOfertaSeleccionada(null);
    setConfirmando(false);
    setExito(false);
  };

  const postular = () => {
    setConfirmando(true);
  };

  const confirmarPostulacion = () => {
    setConfirmando(false);
    setExito(true);

    setTimeout(() => {
      navigate("/estadopostulacion");
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Ofertas Laborales disponibles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {ofertas.map((oferta) => (
          <div
            key={oferta.id}
            className="bg-white rounded-lg shadow-md flex flex-col items-center p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => abrirModal(oferta)}
          >
            <img
              src={oferta.imagen}
              alt={oferta.titulo}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-center">{oferta.titulo}</h2>
            <p className="text-gray-600 text-center">{oferta.descripcion.slice(0, 80)}...</p>
            <button
              className="mt-4 px-6 py-2 rounded text-white transition"
              style={{ backgroundColor: "#E56420" }}
              onClick={(e) => {
                e.stopPropagation();
                abrirModal(oferta);
              }}
            >
              Más info / Postular
            </button>
          </div>
        ))}
      </div>

      {ofertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={cerrarModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Cerrar modal"
            >
              ×
            </button>
            <img
              src={ofertaSeleccionada.imagen}
              alt={ofertaSeleccionada.titulo}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">{ofertaSeleccionada.titulo}</h2>
            <p className="text-gray-700 mb-4">{ofertaSeleccionada.descripcion}</p>
            <p className="font-semibold mb-6">Tipo MBTI requerido: {ofertaSeleccionada.mbti}</p>

            {confirmando ? (
              <>
                <p className="mb-4 text-gray-800">
                  ¿Estás seguro que deseas postular a este perfil?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={confirmarPostulacion}
                  >
                    Sí
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setConfirmando(false)}
                  >
                    No
                  </button>
                </div>
              </>
            ) : exito ? (
              <>
                <p className="mb-4 text-green-600 font-semibold">
                  ¡Postulación realizada correctamente!
                </p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={cerrarModal}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={postular}
                >
                  Postular
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Postulacion;
