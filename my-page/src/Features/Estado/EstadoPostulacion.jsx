import React, { useEffect, useState } from "react";
import {  obtenerFechasConUsuario } from "../Auth/apiOfertas";
// import { obtenerFechasConUsuario } from "../Auth/apiOfertas";



const pasos = ["Registrado", "Validacion documento", "Aprobacion Solicitud"];
const formatearFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();
  return `${dia}${mes}${año}`; // ejemplo: 1862025
};

function EstadoPostulacion() {
  const [postulacion, setPostulacion] = useState(null);


  useEffect(() => {
   const cargarDatos = async () => {
  const userId = parseInt(localStorage.getItem('userId'));
  const data = await obtenerFechasConUsuario(userId);
  // const data2 = await marcarValidacion(userId);
  console.log(data)

  if (data.length > 0) {
    setPostulacion(data[0]);
    //  console.log("📌 Datos de postulación:", data[0]); // ← Agrega esto
  }
};

    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-10 text-center" style={{ color: "black" }}>
        Estado de solicitud
      </h1>

      {/* Línea de pasos */}
      <div className="flex items-center justify-center space-x-4 mb-10">
      {pasos.map((paso, index) => {
  let activo = false;
  let textoPaso = paso;
  let mensajeAdicional = "";

  if (index === 0 && postulacion?.fecha) {
    activo = true;
  } else if (index === 1 && postulacion?.fechaValidacion) {
    activo = true;
    textoPaso = "Validación documento (Revisada)";
  } else if (index === 2 && postulacion?.fechaAprobacion) {
    activo = true;
    textoPaso = "Aprobación solicitud (Revisada)";
    if (postulacion.estadoAprobacion === "ACEPTADA") {
      mensajeAdicional = "✅ Aceptada";
    } else if (postulacion.estadoAprobacion === "RECHAZADA") {
      mensajeAdicional = "❌ Rechazada";
    } else {
      mensajeAdicional = "⏳ Pendiente";
    }
  }

  return (
    <React.Fragment key={index}>
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            activo ? 'bg-green-700 text-white' : 'bg-yellow-300 text-black'
          }`}
        >
          {index + 1}
        </div>
        <span className="mt-2 text-sm text-center max-w-[140px] font-medium text-black">
          {textoPaso}
        </span>
        {mensajeAdicional && (
          <span
            className={`text-xs mt-1 text-center max-w-[140px] ${
              postulacion.estadoAprobacion === "ACEPTADA"
                ? "text-green-700"
                : postulacion.estadoAprobacion === "RECHAZADA"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {mensajeAdicional}
          </span>
        )}
      </div>
      {index < pasos.length - 1 && <div className="w-8 h-1 bg-gray-300 rounded"></div>}
    </React.Fragment>
  );
})}



      </div>

      {/* Información adicional */}
      <div className="max-w-md mx-auto mb-8 p-4 border rounded-md bg-gray-50" style={{ color: "black" }}>
        <p className="mb-1">
  <strong>No postulación:</strong> {postulacion ? formatearFecha(postulacion.createdAt) : 'Cargando...'}
</p>
        <p>
          <strong>Tipo de trámite:</strong> Postulación oferta laboral
        </p>
      </div>

      {/* Tabla de estado */}
      <div className="overflow-x-auto max-w-md mx-auto">
        <table className="w-full text-left border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300" style={{ color: "black" }}>Estado</th>
              <th className="px-4 py-2 border-b border-gray-300" style={{ color: "black" }}>Fecha de aprobación</th>
            </tr>
          </thead>
          <tbody>
            {pasos.map((estado, i) => (
              <tr key={i} className="even:bg-gray-50">
               <td className="px-4 py-2 border-b border-gray-300 text-black">
  {i === 1 && postulacion?.fechaValidacion
    ? "Validación documento (Revisada)"
    : estado}
</td>
              <td className="px-4 py-2 border-b border-gray-300 text-black">
  {i === 0 && postulacion?.fecha && new Date(postulacion.fecha).toLocaleDateString()}
  {i === 1 && postulacion?.fechaValidacion && new Date(postulacion.fechaValidacion).toLocaleDateString()}
  {i === 2 && postulacion?.fechaAprobacion && new Date(postulacion.fechaAprobacion).toLocaleDateString()}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EstadoPostulacion;
