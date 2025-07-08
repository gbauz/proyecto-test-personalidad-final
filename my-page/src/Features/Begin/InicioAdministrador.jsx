
// import { resumenDashboard, resumenDashboardApi  } from "./apiBegin";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { resumenDashboardApi , } from "./apiBegin";


const DashboardResumen = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await resumenDashboardApi();
        if (res.isSuccess && res.data) setResumen(res.data);
      } catch (error) {
        console.error("Error al cargar el resumen del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👋 Bienvenido de nuevo</h1>
      <p className="text-gray-600 mb-8">
        Panel de control general para monitorear usuarios, test y reportes.
        Navega usando el menú lateral para más opciones.
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : resumen ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-orange-500 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm">Nuevos usuarios</p>
              <p className="text-2xl font-bold">{resumen.nuevosUsuarios}</p>
            </div>
            <div className="bg-black text-white p-4 rounded-xl shadow-md">
              <p className="text-sm">Tests completados</p>
              <p className="text-2xl font-bold">{resumen.testsCompletados}</p>
            </div>
            <div className="bg-gray-200 text-gray-900 p-4 rounded-xl shadow-md">
              <p className="text-sm">Reportes pendientes</p>
              <p className="text-2xl font-bold">{resumen.reportesPendientes}</p>
            </div>
            <div className="bg-white border p-4 rounded-xl shadow-md">
              <p className="text-sm font-semibold text-orange-600">Actividad</p>
              <p className="text-xs">Alta interacción esta semana</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Resultados MBTI - Esta semana</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resumen.resultadosMBTI} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="cantidad" fill="#f97316" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="cantidad" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>No se pudo cargar la información del dashboard.</p>
      )}
    </div>
  );
};

export default DashboardResumen;
