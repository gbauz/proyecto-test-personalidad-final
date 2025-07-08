import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface TestLlenado {
  id: number;
  fecha: string;
  resultado: string;
}

const TestsLlenadosPage = () => {
  const [tests, setTests] = useState<TestLlenado[]>([]);

  useEffect(() => {
    // Simulación de fetch. Aquí se reemplaza con un fetch real al backend.
    const mockTests: TestLlenado[] = [
      { id: 1, fecha: "2025-06-08", resultado: "INTJ" },
    ];
    setTests(mockTests);
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-gray-900"
      >
        Tests Completados
      </Motion.h1>

      <p className="text-center text-gray-600 mt-2 mb-10">
        Aquí puedes ver el historial de tus tests llenados.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-[#EB4B15] text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Resultado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {tests.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No hay tests registrados aún.
                </td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr key={test.id} className="border-t border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-4">{test.id}</td>
                  <td className="px-6 py-4">{test.fecha}</td>
                  <td className="px-6 py-4 font-medium">{test.resultado}</td>
                  <td className="px-6 py-4">
                    <button className="bg-[#EB4B15] hover:bg-orange-600 text-white py-1 px-4 rounded flex items-center gap-1">
                      Ver detalles <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestsLlenadosPage;
