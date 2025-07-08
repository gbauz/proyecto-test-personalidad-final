import React, { useEffect, useState } from 'react';
import { fetchPerfilByUserId, Perfil } from '../Auth/apiPerfil';

interface PostulanteDetalleProps {
  nombre: string;
  fotoPerfil: string;
  postulanteId: number;
  onFinalizar: () => void;
}

const PostulanteDetalle: React.FC<PostulanteDetalleProps> = ({ nombre, fotoPerfil, postulanteId, onFinalizar }) => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetchPerfilByUserId(postulanteId);
        if (res.isSuccess && res.data) {
          setPerfil(res.data);
        }
      } catch (err) {
        console.error('Error al obtener perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [postulanteId]);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={fotoPerfil}
          alt={nombre}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{nombre}</h2>
          {perfil?.curriculum ? (
            <a
              href={`http://localhost:3001/${perfil.curriculum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline"
            >
              Ver CV
            </a>
          ) : (
            <span className="text-sm text-gray-500 italic">CV no disponible</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Resultados del Test</h3>
        <p className="font-bold">ISTJ</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 text-sm">
          <li>Suele ser una persona tranquila y seria, que obtiene el éxito por medio de la minuciosidad y la fiabilidad de sus resultados.</li>
          <li>Práctico, realista, orientado a resultados y responsable. Decide lo que debe hacerse empleando la lógica y trabaja en ello de manera constante, sin importar las distracciones.</li>
          <li>Disfruta haciendo las cosas de manera ordenada y organizada – su trabajo, su casa, su vida. Valora las tradiciones y la lealtad.</li>
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={onFinalizar}
          className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Finalizar proceso
        </button>
      </div>
    </div>
  );
};

export default PostulanteDetalle;
