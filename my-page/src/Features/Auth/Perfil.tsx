import React, { useState, useEffect } from "react";
import { fetchPerfilByUserId, updatePerfil } from "./apiPerfil";
import { registerUser, fetchUserBasicInfo } from './apiRegister';

 
interface Perfil {
  userId: number;
  cedula: string;
  sexo: string;
  pais: string;
  ciudad: string;
  fotoPerfil?: string;
  curriculum?: string;
  name?: string;
  email?: string;
}

const Perfil = () => {
  const [perfil, setPerfil] = useState<Perfil>({
    userId: 0,
    cedula: "",
    sexo: "",
    pais: "",
    ciudad: "",
    name: "",
    email: "",
  });

  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userIdStr = localStorage.getItem("userId");
  const userId = userIdStr ? Number(userIdStr) : null;

useEffect(() => {
  if (!userId) {
    setError("Debes iniciar sesión para acceder al perfil");
    return;
  }

  setLoading(true);

  fetchPerfilByUserId(userId)
    .then(async ({ isSuccess, data }) => {
      if (isSuccess && data) {
        setPerfil(data);
      } else {
        const userInfo = await fetchUserBasicInfo(userId);
        setPerfil(prev => ({
          ...prev,
          userId,
          name: userInfo.name,
          email: userInfo.email,
        }));
      }
    })
    .catch(() => setError("Error al cargar perfil"))
    .finally(() => setLoading(false));
}, [userId]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  if (name === "cedula") {
    // Solo permitir números y máximo 10 caracteres
    const numericValue = value.replace(/\D/g, ""); // elimina letras
    if (numericValue.length <= 10) {
      setPerfil(prev => ({ ...prev, cedula: numericValue }));
    }
  } else {
    setPerfil(prev => ({ ...prev, [name]: value }));
  }
};




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("UserId no definido, inicia sesión primero");
      return;
    }
      if (perfil.cedula.length !== 10) {
    setError("La cédula debe tener exactamente 10 números");
    return;
  }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      formData.append("cedula", perfil.cedula);
      formData.append("sexo", perfil.sexo);
      formData.append("pais", perfil.pais);
      formData.append("ciudad", perfil.ciudad);
      formData.append("name", perfil.name || "");
      formData.append("email", perfil.email || "");
      if (fotoPerfilFile) formData.append("fotoPerfil", fotoPerfilFile);
      if (curriculumFile) formData.append("curriculum", curriculumFile);

      const res = await updatePerfil(formData);
      alert(res.message);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center text-black">Editar Perfil</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="mb-4 text-center">Cargando...</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block mb-1 font-semibold text-black">Nombre</label>
          <input
            type="text"
            name="name"
            value={perfil.name || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300 text-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold text-black">Email</label>
          <input
            type="email"
            name="email"
            value={perfil.email || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300 text-black"
          />
        </div>

        {/* Cédula */}
        {/* Cédula */}
<div>
  <label className="block mb-1 font-semibold text-black">Cédula</label>
  <input
    type="text"
    name="cedula"
    value={perfil.cedula}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border rounded border-gray-300 text-black"
  />
  {error.includes("cédula") && (
    <p className="text-red-500 text-sm mt-1">La cédula debe tener exactamente 10 números</p>
  )}
</div>


        {/* Sexo */}
        <div>
          <label className="block mb-1 font-semibold text-black">Sexo</label>
          <select
            name="sexo"
            value={perfil.sexo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300 text-black"
          >
            <option value="">Seleccione</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        {/* País */}
        <div>
          <label className="block mb-1 font-semibold text-black">País</label>
          <input
            type="text"
            name="pais"
            value={perfil.pais}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300 text-black"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block mb-1 font-semibold text-black">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={perfil.ciudad}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300 text-black"
          />
        </div>

        {/* Foto de perfil */}
        <div>
          <label className="block mb-1 font-semibold text-black">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoPerfilFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {perfil.fotoPerfil && (
            <img
              src={`http://localhost:3001/${perfil.fotoPerfil}`}
              alt="Foto de perfil"
              className="mt-2 h-20 w-20 object-cover rounded-full"
            />
          )}
        </div>

        {/* Currículum */}
        <div>
          <label className="block mb-1 font-semibold text-black">Currículum (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCurriculumFile(e.target.files?.[0] || null)}
            className="w-full"
          />
          {perfil.curriculum && (
            <a
              href={`http://localhost:3001/${perfil.curriculum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              Ver currículum actual
            </a>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default Perfil;
