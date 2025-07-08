import React, { useEffect, useState } from "react";
import { crearOferta, obtenerOfertasParaPostulante } from "./apiOfertas";

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
}

const FormularioOfertaFlowbite = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    sueldo: "",
    modalidad: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);

  const creadorId = Number(localStorage.getItem("userId"));
  const roleName = localStorage.getItem("roleName");

  const fetchOfertas = async () => {
    setLoading(true);
    try {
      const response = await obtenerOfertasParaPostulante(creadorId);
      if (response.isSuccess) {
        setOfertas(response.data ?? []);
      } else {
        setMensaje(response.message || "No se pudieron cargar las ofertas.");
        setOfertas([]);
      }
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
      setMensaje("Error al cargar las ofertas.");
      setOfertas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await crearOferta({
        ...form,
        sueldo: parseFloat(form.sueldo),
        creadorId,
      });

      if (result.isSuccess) {
        setMensaje("Oferta creada correctamente.");
        setForm({ nombre: "", descripcion: "", sueldo: "", modalidad: "" });
        fetchOfertas();
      } else {
        setMensaje(result.message || "No se pudo crear la oferta.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error en el servidor.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form className="mb-8" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Crear Nueva Oferta</h2>

        <div className="mb-5">
          <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
            Nombre del puesto
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Desarrollador Frontend"
            className="w-full border border-gray-300 p-2 rounded text-black"
            style={{ color: "black" }}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            placeholder="Breve descripción del puesto"
            className="w-full border border-gray-300 p-2 rounded text-black"
            style={{ color: "black" }}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="sueldo" className="block mb-2 text-sm font-medium text-gray-900">
            Sueldo
          </label>
          <input
            type="number"
            id="sueldo"
            name="sueldo"
            value={form.sueldo}
            onChange={handleChange}
            required
            placeholder="Ej: 45000"
            className="w-full border border-gray-300 p-2 rounded text-black"
            style={{ color: "black" }}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="modalidad" className="block mb-2 text-sm font-medium text-gray-900">
            Modalidad
          </label>
          <select
            id="modalidad"
            name="modalidad"
            value={form.modalidad}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded text-black"
            style={{ color: "black" }}
          >
            <option value="">Selecciona una modalidad</option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Oferta
        </button>

        {mensaje && <p className="mt-3 text-sm text-red-600">{mensaje}</p>}
      </form>

      <h3 className="text-lg font-semibold mb-2">Ofertas Creadas</h3>

      {loading ? (
        <p className="text-black">Cargando ofertas...</p>
      ) : ofertas.length === 0 ? (
        <p className="text-black">No hay ofertas creadas aún.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="w-full text-sm text-left text-black">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Descripción</th>
                <th className="px-4 py-2 border-b">Sueldo</th>
                <th className="px-4 py-2 border-b">Modalidad</th>
                <th className="px-4 py-2 border-b">Creado por</th>
                <th className="px-4 py-2 border-b">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((oferta) => (
                <tr key={oferta.id} className="text-black">
                  <td className="px-4 py-2">{oferta.nombre}</td>
                  <td className="px-4 py-2">{oferta.descripcion}</td>
                  <td className="px-4 py-2">${oferta.sueldo}</td>
                  <td className="px-4 py-2">{oferta.modalidad}</td>
                  <td className="px-4 py-2">{oferta.creador?.name || "Desconocido"}</td>
                  <td className="px-4 py-2">{new Date(oferta.creadoEn).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormularioOfertaFlowbite;
