import React, { useEffect, useState } from "react";
import { obtenerTestsCompletados, TestCompletado } from "./api";

console.log( )

const TestList = () => {
  const [data, setData] = useState<TestCompletado[]>([]);
  const [loading, setLoading] = useState(true);
console.log(data[0])
  const [nombre, setNombre] = useState("");
  const [personalidad, setPersonalidad] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const rol = localStorage.getItem("rolName");
  const userId = localStorage.getItem("userId");

  const isPostulante = rol === "Postulante";

 

  const aplicarFiltros = (reset = false) => {
    const filtros = reset
      ? {}
      : {
          ...(isPostulante && userId ? { idUsuario: userId } : {}),
          ...(!isPostulante && nombre && { nombre }),
          ...(!isPostulante && personalidad && { personalidad }),
          ...(!isPostulante && desde && { desde }),
          ...(!isPostulante && hasta && { hasta }),
        };

    setLoading(true);
    obtenerTestsCompletados(filtros)
      .then((res) => {
        if (res.isSuccess && res.data) {
          setData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error al aplicar filtros:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    aplicarFiltros();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Tests Completados
      </h1>
{/* <a
  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`http://localhost:5173/test/resultado`)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.04 8.98h4.92V24H.04V8.98zM7.98 8.98h4.72v2.05h.07c.66-1.24 2.27-2.55 4.67-2.55 5 0 5.92 3.29 5.92 7.56V24h-4.92v-7.9c0-1.89-.03-4.32-2.63-4.32-2.64 0-3.05 2.06-3.05 4.18V24H7.98V8.98z" />
  </svg>
  Compartir en LinkedIn
</a> */}


      {!isPostulante && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            aplicarFiltros();
          }}
          className="max-w-7xl mx-auto flex flex-wrap gap-4 items-end justify-between mb-8"
        >
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1 min-w-[200px] bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            placeholder="Filtrar por personalidad"
            value={personalidad}
            onChange={(e) => setPersonalidad(e.target.value)}
            className="flex-1 min-w-[200px] bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm focus:ring focus:ring-blue-200"
          />
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm focus:ring focus:ring-blue-200"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={() => {
              setNombre("");
              setPersonalidad("");
              setDesde("");
              setHasta("");
              aplicarFiltros(true);
            }}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition text-sm"
          >
            Restablecer filtros
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Array.isArray(data) &&
            data.map((test) => (
              <div
                key={test.id}
                className="bg-white shadow rounded-lg p-5 border border-gray-200 text-sm hover:shadow-md transition"
              >
                <div className="mb-3">
                  <h2 className="text-base font-bold text-blue-700 truncate">
                    Personalidad: {test.personalidades?.nombre || "N/A"}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    Test ID: {test.usuariotest?.codigo || "N/A"}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 text-xs whitespace-pre-line break-words">

                    <span className="font-medium">Descripción:</span>{" "}
                    {test.personalidades?.descripcion || "Sin descripción"}
                  </p>
                </div>

                <div className="text-gray-600 text-xs space-y-1">
                  <p>
                    <span className="font-semibold">Usuario:</span>{" "}
                    {test.usuariotest?.user?.name || "Desconocido"}
                  </p>
                  <p>
                    <span className="font-semibold">Correo:</span>{" "}
                    {test.usuariotest?.user?.email || "No disponible"}
                  </p>
                  <p>
                    <span className="font-semibold">Fecha:</span>{" "}
                    {test.createdAt
                      ? new Date(test.createdAt).toLocaleDateString()
                      : "Fecha no disponible"}
                  </p>
                </div>

                <div className="mt-3 text-[11px] text-gray-400">
                  ID Test: {test.id} | ID Usuario Test: {test.idUsuarioTest}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TestList;
