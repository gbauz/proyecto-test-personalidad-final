import React, { useEffect, useState } from "react";
import {
  obtenerOfertasParaPostulante,
  postularAOferta,
  verificarPostulacion,
} from "./apiOfertas";
import { useNavigate } from "react-router-dom";

interface Oferta {
  id: number;
  nombre: string;
  descripcion: string;
  sueldo: number;
  modalidad: string;
  creadoEn: string;
  creador: {
    name: string;
  };
}

const OfertasPostulante = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtroModalidad, setFiltroModalidad] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  const [postulando, setPostulando] = useState(false);
  const [mensajePostulacion, setMensajePostulacion] = useState("");

  const userId = Number(localStorage.getItem("userId"));
  const roleName = localStorage.getItem("roleName");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarYObtener = async () => {
      
      try {
        const resultado = await verificarPostulacion(userId);
        if (resultado.isSuccess && resultado.yaPostulado) {
          navigate("/estadopostulacion");
          return;
        }

        const response = await obtenerOfertasParaPostulante(userId);
        if (response.isSuccess) {
          setOfertas(response.data);
  } else {
          setError(response.message || "No se pudieron cargar las ofertas.");
        }
      } catch (err) {
        console.error(err);
        setError("Debes realizar el test para poder ver las ofertas.");
      } finally {
        setLoading(false);
      }
    };

    verificarYObtener();
  }, [userId, roleName, navigate]);

  const ofertasFiltradas = ofertas.filter((oferta) => {
    const coincideBusqueda = oferta.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideModalidad = filtroModalidad
      ? oferta.modalidad === filtroModalidad
      : true;

    return coincideBusqueda && coincideModalidad;
  });

  const abrirModal = (oferta: Oferta) => {
    setOfertaSeleccionada(oferta);
    setMensajePostulacion("");
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setOfertaSeleccionada(null);
    setMensajePostulacion("");
  };

  const confirmarPostulacion = async () => {
    if (!ofertaSeleccionada) return;
    setPostulando(true);

    try {
      const response = await postularAOferta(ofertaSeleccionada.id, userId);

      if (response.isSuccess) {
        setMensajePostulacion("¡Postulación exitosa!");
        setTimeout(() => {
          setModalVisible(false);
          setOfertaSeleccionada(null);
          navigate("/estadopostulacion");
        }, 1000);
      } else {
        setMensajePostulacion(response.message || "Error al postular. Intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
      setMensajePostulacion("Error al postular. Intenta nuevamente.");
    } finally {
      setPostulando(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  if (loading) {
    return <div className="text-center mt-5">Cargando ofertas...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ofertas Disponibles</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="placeholder-black text-black border border-gray-300 p-2 rounded w-full"
        />

        <select
          value={filtroModalidad}
          onChange={(e) => setFiltroModalidad(e.target.value)}
          className="text-black border border-gray-300 p-2 rounded w-full md:w-1/3"
        >
          <option value="">Todas las modalidades</option>
          <option value="Presencial">Presencial</option>
          <option value="Remoto">Remoto</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      {ofertasFiltradas.length === 0 ? (
        <p>No hay ofertas disponibles con los filtros seleccionados.</p>
      ) : (
        <div className="space-y-4">
          {ofertasFiltradas.map((oferta) => (
            <div
              key={oferta.id}
              className="border border-gray-300 p-4 rounded shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{oferta.nombre}</h3>
              <p className="text-gray-600">{oferta.descripcion}</p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Modalidad:</strong> {oferta.modalidad}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Sueldo:</strong> ${oferta.sueldo}
              </p>
              <p className="text-sm text-gray-500 italic">
  Publicado por: {oferta.creador?.name || 'Anónimo'} —{" "}
  {new Date(oferta.creadoEn).toLocaleDateString()}
</p>
              <button
                onClick={() => abrirModal(oferta)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Postular
              </button>
            </div>
          ))}
        </div>
      )}

      {modalVisible && ofertaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Confirmar postulación</h3>
            <p className="mb-4">
              ¿Estás seguro de que deseas postularte para la oferta{" "}
              <strong>{ofertaSeleccionada.nombre}</strong>?
            </p>

            {mensajePostulacion && (
              <p
                className={`mb-4 ${
                  mensajePostulacion.includes("exitosa")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {mensajePostulacion}
              </p>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={cerrarModal}
                disabled={postulando}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPostulacion}
                disabled={postulando}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {postulando ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfertasPostulante;
